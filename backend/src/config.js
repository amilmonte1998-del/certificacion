function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta configurar la variable de entorno ${name}.`);
  }

  return value;
}

function getSupabaseConfig() {
  return {
    url: requireEnv("SUPABASE_URL"),
    serviceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    certificatesTable: process.env.SUPABASE_CERTIFICATES_TABLE || "certificates",
    batchesTable: process.env.SUPABASE_BATCHES_TABLE || "certificate_batches",
  };
}

function getR2Config() {
  const endpoint =
    process.env.R2_ENDPOINT ||
    `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`;

  return {
    endpoint,
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    bucket: requireEnv("R2_BUCKET"),
    signedUrlExpiresSeconds: Number(process.env.R2_SIGNED_URL_EXPIRES_SECONDS || 300),
  };
}

module.exports = {
  getR2Config,
  getSupabaseConfig,
};
