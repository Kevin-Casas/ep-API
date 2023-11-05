var models = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const usuario = require("../models/usuario");

module.exports = {

  //Login
  login(req, res) {

    let {numLegajo, contraseña} = req.body;

    //Buscar usuario
    models.usuario.findOne({
      where: {
        numLegajo: numLegajo
      }
    }).then(usuario => {

      //No existe el usuario 
      if(!usuario) {
        res.status(404).json({msg: "Usuario no encontrado"});

      } else {
        //Contraseña correcta
        if(bcrypt.compareSync(contraseña, usuario.contraseña)) {

          //Creacion de token
          let token = jwt.sign({usuario: usuario}, 
            authConfig.secreto, 
            {expiresIn: authConfig.expires
          });

          res.json({
            usuario: usuario,
            token, token
          })

          //Contraseña incorrecta
        } else {
          res.status(401).json({msg: "ContraseñaIncorrecta"})
        }
      }

    }).catch(err => {
      res.status(500).json(err);
    })

  },

  //Registrar
  registrar(req, res) {

    let contraseña


    //Encriptacion de contraseña
    contraseña = bcrypt.hashSync(req.body.contraseña, Number.parseInt(authConfig.rounds));
   

    //Creacion de usuario
    models.usuario.create({
      nombre: req.body.nombre,
      numLegajo: req.body.numLegajo,
      contraseña: contraseña
    }).then(usuario => {

      //Creacion de token
      let token = jwt.sign({usuario: usuario}, 
        authConfig.secreto, 
        {expiresIn: authConfig.expires
      });

      res.json({
        usuario: usuario,
        token: token
      });

    }).catch(err => {
      res.status(500).json(err);
    });
  }
}