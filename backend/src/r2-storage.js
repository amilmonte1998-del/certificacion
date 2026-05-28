const fs = require("fs");

const { GetObjectCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { getR2Config } = require("./config");

let s3Client;

function getClient() {
  if (!s3Client) {
    const config = getR2Config();

    s3Client = new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  return s3Client;
}

function attachmentHeader(fileName) {
  const asciiName = fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
  return `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

async function uploadPdf({ filePath, key, fileName }) {
  const config = getR2Config();
  const stats = await fs.promises.stat(filePath);

  await getClient().send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: fs.createReadStream(filePath),
      ContentLength: stats.size,
      ContentType: "application/pdf",
      ContentDisposition: attachmentHeader(fileName),
    })
  );

  return {
    key,
    size: stats.size,
  };
}

async function createDownloadUrl({ key, fileName }) {
  const config = getR2Config();
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ResponseContentType: "application/pdf",
    ResponseContentDisposition: attachmentHeader(fileName),
  });

  return getSignedUrl(getClient(), command, {
    expiresIn: config.signedUrlExpiresSeconds,
  });
}

async function getObjectStream(key) {
  const config = getR2Config();
  const response = await getClient().send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    })
  );

  return response.Body;
}

module.exports = {
  createDownloadUrl,
  getObjectStream,
  uploadPdf,
};
