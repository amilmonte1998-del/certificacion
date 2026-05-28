const { createClient } = require("@supabase/supabase-js");

const { getSupabaseConfig } = require("./config");

let supabaseClient;

function getClient() {
  if (!supabaseClient) {
    const config = getSupabaseConfig();

    supabaseClient = createClient(config.url, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}

function getTables() {
  const config = getSupabaseConfig();

  return {
    certificates: config.certificatesTable,
    batches: config.batchesTable,
  };
}

function mapCertificateRow(row) {
  return {
    id: row.id,
    batchId: row.batch_id,
    name: row.person_name,
    document: row.document,
    documentNormalized: row.document_normalized,
    course: row.course,
    date: row.issue_date,
    hours: row.hours,
    fileName: row.file_name,
    fileKey: row.file_key,
    fileSize: row.file_size,
    createdAt: row.created_at,
    data: row.data,
  };
}

function mapBatchRow(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    excelOriginalName: row.excel_original_name,
    templateOriginalName: row.template_original_name,
    totalRows: row.total_rows,
    generatedCount: row.generated_count,
    skippedCount: row.skipped_count,
    errorCount: row.error_count,
  };
}

async function createBatch(batch) {
  const client = getClient();
  const tables = getTables();
  const { data, error } = await client
    .from(tables.batches)
    .insert({
      id: batch.id,
      created_at: batch.createdAt,
      excel_original_name: batch.excelOriginalName,
      template_original_name: batch.templateOriginalName,
      total_rows: batch.totalRows,
      generated_count: batch.generatedCount,
      skipped_count: batch.skippedCount,
      error_count: batch.errorCount,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Supabase no pudo crear el lote: ${error.message}`);
  }

  return mapBatchRow(data);
}

async function updateBatchCounts(batchId, counts) {
  const client = getClient();
  const tables = getTables();
  const { data, error } = await client
    .from(tables.batches)
    .update({
      generated_count: counts.generatedCount,
      skipped_count: counts.skippedCount,
      error_count: counts.errorCount,
    })
    .eq("id", batchId)
    .select()
    .single();

  if (error) {
    throw new Error(`Supabase no pudo actualizar el lote: ${error.message}`);
  }

  return mapBatchRow(data);
}

async function insertCertificate(certificate) {
  const client = getClient();
  const tables = getTables();
  const { data, error } = await client
    .from(tables.certificates)
    .insert({
      id: certificate.id,
      batch_id: certificate.batchId,
      person_name: certificate.name,
      document: certificate.document,
      document_normalized: certificate.documentNormalized,
      course: certificate.course,
      issue_date: certificate.date,
      hours: certificate.hours,
      file_name: certificate.fileName,
      file_key: certificate.fileKey,
      file_size: certificate.fileSize,
      created_at: certificate.createdAt,
      data: certificate.data,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Supabase no pudo guardar el certificado: ${error.message}`);
  }

  return mapCertificateRow(data);
}

async function listCertificatesByDocument(documentNormalized) {
  const client = getClient();
  const tables = getTables();
  const { data, error } = await client
    .from(tables.certificates)
    .select(
      "id,batch_id,person_name,document,document_normalized,course,issue_date,hours,file_name,file_key,file_size,created_at,data"
    )
    .eq("document_normalized", documentNormalized)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Supabase no pudo consultar certificados: ${error.message}`);
  }

  return data.map(mapCertificateRow);
}

async function getCertificateById(id) {
  const client = getClient();
  const tables = getTables();
  const { data, error } = await client
    .from(tables.certificates)
    .select(
      "id,batch_id,person_name,document,document_normalized,course,issue_date,hours,file_name,file_key,file_size,created_at,data"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase no pudo consultar el certificado: ${error.message}`);
  }

  return data ? mapCertificateRow(data) : null;
}

async function getBatchById(id) {
  const client = getClient();
  const tables = getTables();
  const { data, error } = await client
    .from(tables.batches)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase no pudo consultar el lote: ${error.message}`);
  }

  return data ? mapBatchRow(data) : null;
}

async function listCertificatesByBatch(batchId) {
  const client = getClient();
  const tables = getTables();
  const { data, error } = await client
    .from(tables.certificates)
    .select(
      "id,batch_id,person_name,document,document_normalized,course,issue_date,hours,file_name,file_key,file_size,created_at,data"
    )
    .eq("batch_id", batchId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Supabase no pudo consultar certificados del lote: ${error.message}`);
  }

  return data.map(mapCertificateRow);
}

async function getStats() {
  const client = getClient();
  const { data, error } = await client.rpc("get_certificate_stats");

  if (error) {
    throw new Error(`Supabase no pudo calcular estadisticas: ${error.message}`);
  }

  const stats = Array.isArray(data) ? data[0] : data;

  return {
    totalParticipants: Number(stats?.total_participants || 0),
    generatedPdfs: Number(stats?.generated_pdfs || 0),
    totalBatches: Number(stats?.total_batches || 0),
    lastGeneration: stats?.last_generation || null,
  };
}

module.exports = {
  createBatch,
  getBatchById,
  getCertificateById,
  getStats,
  insertCertificate,
  listCertificatesByBatch,
  listCertificatesByDocument,
  updateBatchCounts,
};
