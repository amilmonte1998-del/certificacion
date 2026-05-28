const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const {
  CERTIFICATES_DIR,
  TEMP_DIR,
  createBatchZip,
  ensureStorage,
  generateCertificates,
  getBatchById,
  getCertificateById,
  getStats,
  listCertificatesByDocument,
} = require("./src/certificate-service");

const router = express.Router();

ensureStorage();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, TEMP_DIR);
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const basename = path.basename(file.originalname, extension);
      const safeName = basename
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);

      cb(null, `${Date.now()}-${safeName || "archivo"}${extension}`);
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

function removeUploadedFiles(files = {}) {
  Object.values(files)
    .flat()
    .filter(Boolean)
    .forEach((file) => {
      fs.promises.unlink(file.path).catch(() => {});
    });
}

async function generateCertificatesHandler(req, res) {
  try {
    const excel = req.files?.excel?.[0];
    const template = req.files?.plantilla?.[0];

    if (!excel || !template) {
      return res.status(400).json({
        message: "Debes cargar un archivo Excel y una plantilla HTML.",
      });
    }

    const result = await generateCertificates({
      excelPath: excel.path,
      excelOriginalName: excel.originalname,
      templatePath: template.path,
      templateOriginalName: template.originalname,
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "No fue posible generar los certificados.",
    });
  } finally {
    removeUploadedFiles(req.files);
  }
}

router.get("/salud", (req, res) => {
  res.json({ ok: true });
});

router.get("/estadisticas", async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No fue posible consultar las estadisticas." });
  }
});

router.get("/certificados", async (req, res) => {
  try {
    const documento = String(req.query.documento || "");

    if (!documento.trim()) {
      return res.status(400).json({ message: "Debes enviar el documento a consultar." });
    }

    const certificates = await listCertificatesByDocument(documento);
    res.json({ certificates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No fue posible consultar los certificados." });
  }
});

router.get("/certificados/:id/descargar", async (req, res) => {
  try {
    const certificate = await getCertificateById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificado no encontrado." });
    }

    const absolutePath = path.resolve(CERTIFICATES_DIR, certificate.fileName);

    if (!absolutePath.startsWith(CERTIFICATES_DIR) || !fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "El archivo PDF no existe en el servidor." });
    }

    res.download(absolutePath, certificate.fileName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No fue posible descargar el certificado." });
  }
});

router.get("/lotes/:id/descargar", async (req, res) => {
  try {
    const batch = await getBatchById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: "Lote no encontrado." });
    }

    res.attachment(`certificados-${batch.id.slice(0, 8)}.zip`);
    await createBatchZip(batch.id, res);
  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      res.status(500).json({ message: "No fue posible descargar el lote." });
    }
  }
});

router.post(
  "/certificados/generar",
  upload.fields([
    { name: "excel", maxCount: 1 },
    { name: "plantilla", maxCount: 1 },
  ]),
  generateCertificatesHandler
);

router.post(
  "/subir",
  upload.fields([
    { name: "excel", maxCount: 1 },
    { name: "plantilla", maxCount: 1 },
  ]),
  generateCertificatesHandler
);

module.exports = router;
