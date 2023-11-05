var express = require("express");
var router = express.Router();
var models = require("../models");

/**
 * @swagger
 * components:
 *  schemas:
 *    Edificio:
 *      type: object
 *      required:
 *        - nombre
 *        - direccion
 *        - tipo
 *      properties:
 *        nombre:
 *          type: string
 *          description: Nombre de edificio
 *        direccion:
 *          type: string
 *          description: Direccion del edificio
 *        tipo:
 *          type: string
 *          description: Tipo de edificio
 *      example:
 *        nombre: Malvinas
 *        direccion: Vergara 555
 *        tipo: Mixto
 */

/**
 * @swagger
 * /edi:
 *  get:
 *    summary: Retorna todos los edificios
 *    tags: [Edificio]
 *    responses:
 *      200:
 *        description: Todos los edificios
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Edificio'       
 */
router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  const {pag = 1, limite = 5} = req.query;
  models.edificio
    .findAll({
      //Paginación
      limit: 5,
      offset: (pag - 1) * limite,
      //
      attributes: ["id", "nombre", "direccion", "tipo"],
      include:[{as:"aula", model:models.aula, attributes:["id", "Nombre", "tipo"]}]
    })
    .then(edificios => res.send(edificios))
    .catch(() => res.sendStatus(500));
});

/**
 * @swagger
 * /edi:
 *  post:
 *    summary: Crea un nuevo edificio
 *    tags: [Edificio]
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Edificio'
 *    responses:
 *      200:
 *        description: Nuevo edificio creado
 */
router.post("/", (req, res) => {
  models.edificio
    .create({ nombre: req.body.nombre, direccion: req.body.direccion, tipo: req.body.tipo })
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

/**
 * @swagger
 * /edi/{id}:
 *  get:
 *    summary: Retorna un edificio
 *    tags: [Edificio]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del edificio
 *    responses:
 *      200:
 *        description: Un edificio
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Edificio'
 *      404:
 *        description: El edificio no existe      
 */
router.get("/:id", (req, res) => {
  findEdificio(req.params.id, {
    onSuccess: edificio => res.send(edificio),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

/**
 * @swagger
 * /edi/{id}:
 *  put:
 *    summary: Actualiza un edificio
 *    tags: [Edificio]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del edificio
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Edificio'
 *    responses:
 *      200:
 *        description: Edificio actualizado
 *      404:
 *        description: El edificio no existe      
 */
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

/**
 * @swagger
 * /edi/{id}:
 *  delete:
 *    summary: Elimina un edificio
 *    tags: [Edificio]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del edificio
 *    responses:
 *      200:
 *        description: Edificio eliminado
 *      404:
 *        description: El edificio no existe      
 */
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
