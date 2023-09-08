var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.edificio
    .findAll({
      attributes: ["id", "nombre", "direccion", "tipo"]
    })
    .then(edificios => res.send(edificios))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.edificio
    .create({ nombre: req.body.nombre, tipo: req.body.direccion, id_edificio: req.body.tipo })
    .then(edificio => res.status(201).send({ id: edificio.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro edificio con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findEdificio = (id, { onSuccess, onNotFound, onError }) => {
  models.edificio
    .findOne({
      attributes: ["id", "nombre", "direccion", "tipo"],
      where: { id }
    })
    .then(edificio => (edificio ? onSuccess(edificio) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findEdificio(req.params.id, {
    onSuccess: edificio => res.send(edificio),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = edificio =>
  edificio
      .update({ nombre: req.body.nombre,direccion: req.body.direccion, tipo: req.body.tipo}, { fields: ["nombre", "direccion", "tipo"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro edificio con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findEdificio(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = edificio =>
  edificio
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findEdificio(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
