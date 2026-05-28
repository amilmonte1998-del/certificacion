id="vqmtgx"
const express = require("express");
const cors = require("cors");

const app = express();

const routes = require("./routes");

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});