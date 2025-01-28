const mongoose = require("mongoose");
require("dotenv").config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("conectado correctamente a la base de datos");
  } catch (error) {
    console.log(error);
    throw new error("no se ha podido conectar a la base de datos");
  }
};

module.exports = connection;
