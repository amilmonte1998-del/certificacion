const path = require("path");

const { generateCertificates } = require("../src/certificate-service");

function getArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : null;
}

async function main() {
  const excel = getArg("excel");
  const template = getArg("template");

  if (!excel || !template) {
    console.error(
      "Uso: npm run generate -- --excel ./datos.xlsx --template ./plantilla.html"
    );
    process.exit(1);
  }

  const result = await generateCertificates({
    excelPath: path.resolve(excel),
    excelOriginalName: path.basename(excel),
    templatePath: path.resolve(template),
    templateOriginalName: path.basename(template),
  });

  console.log(
    JSON.stringify(
      {
        lote: result.batch.id,
        filas: result.batch.totalRows,
        generados: result.batch.generatedCount,
        omitidos: result.batch.skippedCount,
        errores: result.batch.errorCount,
        descargar: result.downloadUrl,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
