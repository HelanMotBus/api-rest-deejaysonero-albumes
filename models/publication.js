const { Schema, model } = require("mongoose");

const PublicationSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  enlace: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now
},
  imagen: {
    type: String,
    default: "default.png",
  },
});

module.exports = model("Albume", PublicationSchema, "albumes");
