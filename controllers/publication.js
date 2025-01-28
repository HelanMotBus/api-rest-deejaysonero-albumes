const fs = require("fs");
const path = require("path");
const Esquema = require("../models/publication");

const pruebaPublication = (req, res) => {
  return res.status(200).send({
    message: "mensaje eviado desde el controlador publication",
  });
};

//MÉTODO PARA CRER ALBUMES Y GUARDARLOS EN LA BASE DE DATOS
const crear = (req, res) => {
  //recoger datos de la peticion
  let params = req.body;

  //crear objeto de publicacion
  const publicacion = new Esquema(params);

  publicacion.save().then((publicacionGuardada) => {
    if (!publicacionGuardada) {
      return res.status(400).json([
        {
          status: "error",
          mensaje: "no se ha guardado el album",
        },
      ]);
    }

    //devolver el resultado
    return res.status(200).json([
      {
        status: "success",
        album: publicacionGuardada,
        mensaje: "album guardado con exito",
      },
    ]);
  });
};
//FIN DEL MÉTODO DE CREAR ALBUMES

//CONSEGUIR ALBUMES DE LA BASE DE DATOS
const listar = (req, res) => {
  let consulta = Esquema.find({}); //trae todos los artículos de la base de datos
  if (req.params.ultimos) {
    //if para verificar si en el endpoint de listar todos los artículos se ingresa un parámetro y así solo mostraría 3 artículos en el home del frontend
    consulta.limit(3);
  }
  consulta
    .sort({ fecha: -1 }) //organiza los artículos creados desde el más nuevo hasta el más viejo
    .exec()
    .then((albumes) => {
      if (!albumes) {
        return res.status(404).json({
          status: "error",
          mensaje: "no se ha guardado el album",
        });
      }
      return res.status(200).send({
        status: "success",
        contador: albumes.length,
        albumes,
      });
    })
    .catch((error) => {
      return res.status(500).json([
        {
          status: "error",
          mensaje: "error en el servidor",
        },
      ]);
    });
}; //FINAL DEL MÉTODO CONSEGUIR ALBUMES DE LA BASE DE DATOS

//CONSEGUIR UN SOLO ALBUM POR SU ID
const uno = (req, res) => {
  //recoger el id por la url
  let id = req.params.id;

  //buscar el artículo
  Esquema.findById(id)
    .then((albumes) => {
      if (!albumes) {
        return res.status(404).json({
          status: "error",
          mensaje: "no se ha encontrado el album",
        });
      }
      return res.status(200).send({
        status: "success",
        albumes,
      });
    })
    .catch((error) => {
      return res.status(500).json([
        {
          status: "error",
          mensaje: "error en el servidor",
        },
      ]);
    });
}; //FINAL DEL MÉTODO CONSEGUIR UN SOLO ALBUM POR SU ID

//BORRAR UN ALBUM BUSCANDO POR SU ID
const borrar = (req, res) => {
  //recoger el id por la url
  let album_id = req.params.id;

  //buscar el artículo
  Esquema.findOneAndDelete({ _id: album_id })
    .then((albumBorrado) => {
      if (!albumBorrado) {
        return res.status(404).json({
          status: "error",
          mensaje: "error al borrar el album",
        });
      }
      return res.status(200).send({
        status: "succes",
        mensaje: "album borrado con éxito",
        album: albumBorrado,
      });
    })
    .catch((error) => {
      return res.status(500).json([
        {
          status: "error",
          mensaje: "error en el servidor",
        },
      ]);
    });
}; //FINAL DEL MÉTODO BORRAR UN ALBUM POR SU ID

//EDITAR UN ALBUM BUSCANDO POR SU ID
const editar = (req, res) => {
  //recoger el id del album a editar por la url
  let albumId = req.params.id;

  //buscar y actualizar el artículo
  Esquema.findOneAndUpdate({ _id: albumId }, req.body, { new: true }) //muestra el album actualizado
    .then((albumActualizado) => {
      if (!albumActualizado) {
        return res.status(404).json({
          status: "error",
          mensaje: "error al actualizar el album",
        });
      }
      return res.status(200).send({
        status: "success",
        mensaje: "album actualizado con éxito",
        album: albumActualizado,
      });
    })
    .catch((error) => {
      return res.status(500).json([
        {
          status: "error",
          mensaje: "error en el servidor",
        },
      ]);
    });
}; //FINAL DEL MÉTODO EDITAR UN ALBUM POR SU ID

//SUBIR UNA IMÁGEN AL BACKEND Y ALMACENARLA EN LA CARPETA IMÁGENES
const subir = (req, res) => {
    //recoger el fichero de imagen subido
    if (!req.file && !req.files) {
      return res.status(404).json([
        {
          status: "error",
          mensaje: "peticion inválida",
        },
      ]);
    }
    //nombre del archivo
    let archivo = req.file.originalname;
  
    //extensión del archivo
    let archivo_split = archivo.split(".");
    let extension = archivo_split[1];
  
    //comprobar si la extensión del  arhivo de la imagen es correcta
    if (
      extension != "png" &&
      extension != "jpg" &&
      extension != "jpeg" &&
      extension != "gif"
    ) {
      //borrar archivo y dar respuesta
      fs.unlink(req.file.path, (error) => {
        return res.status(400).json({
          status: "error",
          mensaje: "imagen inválida",
        });
      });
    } else {
      //recoger el id del artículo a editar por la url
      let albumId = req.params.id;

      //buscar y actualizar el artículo
      Esquema.findOneAndUpdate(
        { _id: albumId },
        { imagen: req.file.filename },
        { new: true }
      ) //muestra el artículo actualizado
        .then((albumActualizado) => {
          if (!albumActualizado) {
            return res.status(404).json({
              status: "error",
              mensaje: "error al actualizar el album",
            });
          }
          return res.status(200).send({
            status: "success",
            mensaje: "album actualizado con éxito",
            album: albumActualizado,
            fichero: req.file,
          });
        })
        .catch((error) => {
          return res.status(500).json([
            {
              status: "error",
              mensaje: "error en el servidor",
            },
          ]);
        });
    }
  }; //FINAL DEL MÉTODO SUBIR IMÁGEN
  
  //MÉTODO PARA MOSTRAR UNA IMAGEN EN EL FRONTEND
  const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/albumes/" + fichero;
  
    fs.stat(ruta_fisica, (error, existe) => {
      if (existe) {
        return res.sendFile(path.resolve(ruta_fisica));
      } else {
        return res.status(404).json({
          status: "error",
          mensaje: "la imagen no existe",
        });
      }
    });
  }; //FINAL DEL MÉTODO MOSTRAR UNA IMAGEN

  //MÉTODO PARA BUSCAR UN ALBUM POR SU NOMBRE
const buscar = (req, res) => {
    //sacar el string de búsqueda por la url
    let busqueda = req.params.busqueda;
  
    //buscar el contenido usando el OR
    Esquema.find({
      $or: [
        //se usa el or porque es como buscar un texto de la base de datos select * from tabla where titulo o contenido
        { nombre: { $regex: busqueda, $options: "i" } }, //se usa regex que son expresiones regulares
        { enlace: { $regex: busqueda, $options: "i" } }, //se usa la i en las options para verificar si se incluye el string de búsqueda
      ],
    })
      .sort({ fecha: -1 })
      .exec()
      .then((albumEncontrado) => {
        if (!albumEncontrado || albumEncontrado.length <=0) {
          return res.status(404).json({
            status: "error",
            mensaje: "error al encontrar el album",
          });
        }
        return res.status(200).send({
          status: "success",
          mensaje: "album encontrado con éxito",
          album: albumEncontrado,
        });
      })
      .catch((error) => {
        return res.status(500).json([
          {
            status: "error",
            mensaje: "error en el servidor",
          },
        ]);
      });
  }; //FINAL DEL MÉTODO DE BUSCAR UN ALBUM
  
  

module.exports = {
  pruebaPublication,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscar
};
