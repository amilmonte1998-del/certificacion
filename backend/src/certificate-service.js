const archiver = require("archiver");
const crypto = require("crypto");
const { parse: parseCsv } = require("csv-parse/sync");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const readXlsxFile = require("read-excel-file/node");

const repository = require("./supabase-repository");
const r2Storage = require("./r2-storage");

const ROOT_DIR = path.resolve(__dirname, "..");
const STORAGE_DIR = path.join(ROOT_DIR, "storage");
const TEMP_DIR = path.join(STORAGE_DIR, "uploads");
const GENERATED_TEMP_DIR = path.join(STORAGE_DIR, "generated");

const FIELD_ALIASES = {
  name: [
    "nombre",
    "nombres",
    "nombre completo",
    "participante",
    "estudiante",
    "asistente",
    "persona",
    "name",
    "full name",
  ],
  document: [
    "documento",
    "numero documento",
    "numero de documento",
    "cedula",
    "cc",
    "identificacion",
    "id",
    "dni",
  ],
  course: [
    "curso",
    "programa",
    "evento",
    "capacitacion",
    "diplomado",
    "certificado",
    "nombre certificado",
    "nombre del certificado",
  ],
  date: ["fecha", "fecha certificado", "fecha de certificado", "fecha evento", "date"],
  hours: ["horas", "duracion", "intensidad", "intensidad horaria", "hours"],
};

function ensureStorage() {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
  fs.mkdirSync(GENERATED_TEMP_DIR, { recursive: true });
}

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeDocument(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
}

function stringifyCell(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object" && Array.isArray(value.richText)) {
    return value.richText.map((part) => part.text || "").join("").trim();
  }

  if (typeof value === "object" && value.text) {
    return String(value.text).trim();
  }

  if (typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "result")) {
    return stringifyCell(value.result);
  }

  if (value instanceof Date) {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(value);
  }

  return String(value).trim();
}

function pickValue(row, aliases) {
  for (const alias of aliases) {
    const key = normalizeKey(alias);

    if (row.normalized[key]) {
      return row.normalized[key];
    }
  }

  return "";
}

async function parseExcelRows(excelPath) {
  const extension = path.extname(excelPath).toLowerCase();
  let sheetRows;

  if (extension === ".csv") {
    const content = await fs.promises.readFile(excelPath, "utf8");
    sheetRows = parseCsv(content, {
      bom: true,
      skip_empty_lines: false,
    });
  } else if (extension === ".xlsx") {
    sheetRows = await readXlsxFile(excelPath);
  } else {
    throw new Error("Solo se admiten archivos .xlsx y .csv.");
  }

  if (!sheetRows.length) {
    throw new Error("El Excel no contiene hojas para procesar.");
  }

  const headers = sheetRows[0].map((cell) => stringifyCell(cell));
  const rows = [];

  sheetRows.slice(1).forEach((sheetRow, index) => {
    const original = {};
    const normalized = {};

    headers.forEach((header, colIndex) => {
      if (!header) {
        return;
      }

      const cleanValue = stringifyCell(sheetRow[colIndex]);
      original[header] = cleanValue;
      normalized[normalizeKey(header)] = cleanValue;
    });

    const name = pickValue({ normalized }, FIELD_ALIASES.name);
    const document = pickValue({ normalized }, FIELD_ALIASES.document);
    const course = pickValue({ normalized }, FIELD_ALIASES.course);
    const date = pickValue({ normalized }, FIELD_ALIASES.date);
    const hours = pickValue({ normalized }, FIELD_ALIASES.hours);

    if (Object.values(normalized).some(Boolean)) {
      rows.push({
        rowNumber: index + 2,
        original,
        normalized,
        canonical: {
          name,
          document,
          documentNormalized: normalizeDocument(document),
          course,
          date,
          hours,
        },
      });
    }
  });

  return rows;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(value) {
  return String(value || "certificado")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function createTemplateContext(row, certificateId) {
  const now = new Date();
  const generatedDate = new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(now);

  return {
    ...row.normalized,
    nombre: row.canonical.name,
    name: row.canonical.name,
    documento: row.canonical.document,
    document: row.canonical.document,
    cedula: row.canonical.document,
    curso: row.canonical.course,
    course: row.canonical.course,
    programa: row.canonical.course,
    fecha: row.canonical.date || generatedDate,
    date: row.canonical.date || generatedDate,
    horas: row.canonical.hours,
    hours: row.canonical.hours,
    codigo: certificateId,
    codigo_certificado: certificateId,
    id_certificado: certificateId,
    fecha_generacion: generatedDate,
  };
}

function renderTemplate(template, context) {
  return template.replace(/{{\s*([\w\s.-]+)\s*}}/g, (match, key) => {
    const normalizedKey = normalizeKey(key);
    return escapeHtml(context[normalizedKey] ?? context[key] ?? "");
  });
}

function injectPrintRuntime(html) {
  const runtime = `
<style>
  @page {
    size: letter landscape;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  [data-fit-text] {
    overflow-wrap: anywhere;
    line-height: 1.08;
  }
</style>
<script>
  window.__fitCertificateText = function () {
    document.querySelectorAll("[data-fit-text]").forEach(function (element) {
      var min = Number(element.dataset.minSize || 18);
      var step = Number(element.dataset.fitStep || 1);
      var current = parseFloat(window.getComputedStyle(element).fontSize);

      while (
        current > min &&
        (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight)
      ) {
        current = current - step;
        element.style.fontSize = current + "px";
      }
    });
  };

  window.addEventListener("load", window.__fitCertificateText);
</script>`;

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${runtime}</head>`);
  }

  return `${runtime}${html}`;
}

async function renderPdf({ browser, html, outputPath }) {
  const page = await browser.newPage();

  try {
    await page.setContent(injectPrintRuntime(html), {
      waitUntil: ["load", "networkidle0"],
    });
    await page.evaluate(() => {
      if (window.__fitCertificateText) {
        window.__fitCertificateText();
      }
    });
    await page.pdf({
      path: outputPath,
      printBackground: true,
      preferCSSPageSize: true,
      format: process.env.PDF_FORMAT || "Letter",
      landscape: process.env.PDF_LANDSCAPE !== "false",
    });
  } finally {
    await page.close();
  }
}

function createPublicCertificate(certificate) {
  return {
    id: certificate.id,
    name: certificate.name,
    document: certificate.document,
    course: certificate.course,
    date: certificate.date,
    hours: certificate.hours,
    fileName: certificate.fileName,
    createdAt: certificate.createdAt,
    downloadUrl: `/api/certificados/${certificate.id}/descargar`,
  };
}

function createFileKey({ batchId, documentNormalized, fileName }) {
  return `certificados/${documentNormalized}/${batchId}/${fileName}`;
}

async function generateCertificates({
  excelPath,
  excelOriginalName,
  templatePath,
  templateOriginalName,
}) {
  ensureStorage();

  const template = await fs.promises.readFile(templatePath, "utf8");
  const rows = await parseExcelRows(excelPath);
  const batchId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const generated = [];
  const skipped = [];
  const errors = [];
  const initialBatch = await repository.createBatch({
    id: batchId,
    createdAt,
    excelOriginalName,
    templateOriginalName,
    totalRows: rows.length,
    generatedCount: 0,
    skippedCount: 0,
    errorCount: 0,
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const row of rows) {
      const { name, document, documentNormalized, course, date, hours } = row.canonical;

      if (!documentNormalized || !name) {
        skipped.push({
          rowNumber: row.rowNumber,
          reason: "La fila no tiene nombre o documento.",
        });
        continue;
      }

      const id = crypto.randomUUID();
      const shortId = id.slice(0, 8);
      const baseFileName = `${documentNormalized}-${slugify(course || "certificado")}-${shortId}.pdf`;
      const outputPath = path.join(GENERATED_TEMP_DIR, baseFileName);
      const fileKey = createFileKey({
        batchId,
        documentNormalized,
        fileName: baseFileName,
      });
      const context = createTemplateContext(row, id);
      const html = renderTemplate(template, context);

      try {
        await renderPdf({ browser, html, outputPath });
        const uploaded = await r2Storage.uploadPdf({
          filePath: outputPath,
          key: fileKey,
          fileName: baseFileName,
        });

        const certificate = await repository.insertCertificate({
          id,
          batchId,
          name,
          document,
          documentNormalized,
          course,
          date,
          hours,
          fileName: baseFileName,
          fileKey: uploaded.key,
          fileSize: uploaded.size,
          createdAt,
          data: row.original,
        });

        generated.push(certificate);
      } catch (error) {
        errors.push({
          rowNumber: row.rowNumber,
          document,
          reason: error.message,
        });
      } finally {
        await fs.promises.unlink(outputPath).catch(() => {});
      }
    }
  } finally {
    await browser.close();
  }

  const batch = await repository.updateBatchCounts(batchId, {
    generatedCount: generated.length,
    skippedCount: skipped.length,
    errorCount: errors.length,
  });

  return {
    batch: batch || initialBatch,
    generated: generated.map(createPublicCertificate),
    skipped,
    errors,
    downloadUrl: `/api/lotes/${batchId}/descargar`,
  };
}

async function listCertificatesByDocument(document) {
  const normalized = normalizeDocument(document);
  const certificates = await repository.listCertificatesByDocument(normalized);

  return certificates.map(createPublicCertificate);
}

async function getCertificateById(id) {
  return repository.getCertificateById(id);
}

async function getBatchById(id) {
  return repository.getBatchById(id);
}

async function createCertificateDownloadUrl(certificate) {
  return r2Storage.createDownloadUrl({
    key: certificate.fileKey,
    fileName: certificate.fileName,
  });
}

async function createBatchZip(batchId, outputStream) {
  const certificates = await repository.listCertificatesByBatch(batchId);

  if (!certificates.length) {
    throw new Error("El lote no contiene certificados para descargar.");
  }

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  await new Promise((resolve, reject) => {
    archive.on("error", reject);
    outputStream.on("close", resolve);
    archive.pipe(outputStream);

    Promise.all(
      certificates.map(async (certificate) => {
        const stream = await r2Storage.getObjectStream(certificate.fileKey);
        archive.append(stream, { name: certificate.fileName });
      })
    )
      .then(() => archive.finalize())
      .catch(reject);
  });
}

async function getStats() {
  return repository.getStats();
}

module.exports = {
  TEMP_DIR,
  createCertificateDownloadUrl,
  createBatchZip,
  ensureStorage,
  generateCertificates,
  getBatchById,
  getCertificateById,
  getStats,
  listCertificatesByDocument,
  normalizeDocument,
};
