id="ynztgx"
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (file.fieldname === "excel") {
      cb(null, "uploads/");
    } else if (file.fieldname === "plantilla") {
      cb(null, "plantillas/");
    }

  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/subir",
  upload.fields([
    { name: "excel", maxCount: 1 },
    { name: "plantilla", maxCount: 1 },
  ]),
  async (req, res) => {

    try {

      res.json({
        mensaje: "Archivos subidos correctamente",
        archivos: req.files,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        mensaje: "Error al subir archivos",
      });

    }

  }
);

module.exports = router;