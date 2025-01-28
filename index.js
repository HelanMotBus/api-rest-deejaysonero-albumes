//importar dependencias

const connection = require("./database/connection")
const express = require("express");
const cors = require("cors");



//mensaje de bienvenida
console.log("api rest node de pagina de musica arrancada");

//conectar base de datos
connection();

//crear servidor de node
const app = express();
const puerto = 3900;

//cofigurar cors
app.use(cors());

//convertir los datos del body a objetos json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//rutas de prueba
app.get("/ruta-prueba", (req,res) => {
    return res.status(200).json(
        "esta es la ruta de prueba del servidor en express")
})

//rutas funcionales
const albumesRoutes = require("./routes/publication");

app.use("/api", albumesRoutes);

//poner servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log("servidor de node corriendo en el puerto: ", puerto);
});