require("dotenv/config");

const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { ensureStorage } = require("./src/certificate-service");

const app = express();
const PORT = process.env.PORT || 3001;

ensureStorage();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origen no permitido por CORS."));
    },
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Servidor de certificados funcionando correctamente",
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const statusCode =
    error.message === "Origen no permitido por CORS." ||
    error.message === "Tipo de archivo no permitido."
      ? 400
      : 500;

  console.error(error.message || error);
  res.status(statusCode).json({
    message: error.message || "Ocurrio un error inesperado.",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
