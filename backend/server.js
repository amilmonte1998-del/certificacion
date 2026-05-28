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
  : true;

app.use(
  cors({
    origin: allowedOrigins,
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
