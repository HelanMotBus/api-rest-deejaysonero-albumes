const express = require("express");
const multer = require("multer");
const router = express.Router();
const PublicationController = require("../controllers/publication");

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/albumes/");
  },

  filename: function (req, file, cb) {
    cb(null, "Dee-Jay-Sonero" + Date.now() + file.originalname);
  },
});

const subidas = multer({ storage: almacenamiento });

//definir ruta
router.get("/prueba-album", PublicationController.pruebaPublication); //ruta para crear un album
router.post("/crear", PublicationController.crear); //ruta para crear un album
router.get("/listar/:ultimos?", PublicationController.listar); //ruta para mostrar todos los albumes
router.get("/album/:id", PublicationController.uno); //ruta para mostrar un album por su id
router.delete("/album/:id", PublicationController.borrar); //ruta para borrar un album por su id
router.put("/album/:id", PublicationController.editar); //ruta para editar un album por su id
router.post(
  "/subir-imagen/:id",
  subidas.single("file0"),
  PublicationController.subir
); //ruta para subir una imagen de un album
router.get("/imagen/:fichero", PublicationController.imagen); //ruta para mostrar la imagen de un album previamente subida
router.get("/buscar/:busqueda", PublicationController.buscar);//ruta para buscar un album por su nombre

//exportar ruta
module.exports = router;
