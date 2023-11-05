var express = require("express");
var router = express.Router();
var models = require("../models");

/**
 * @swagger
 * components:
 *  schemas:
 *    Aula:
 *      type: object
 *      required:
 *        - nombre
 *        - tipo
 *      properties:
 *        nombre:
 *          type: string
 *          description: Nombre de aula
 *        tipo:
 *          type: string
 *          description: Tipo de aula
 *      example:
 *        nombre: MV 101
 *        tipo: Mixto
 */

/**
 * @swagger
 * /aul:
 *  get:
 *    summary: Retorna todas las aulas
 *    tags: [Aula]
 *    responses:
 *      200:
 *        description: Todas las aulas
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Aula'       
 */
router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  const {pag= 1, limite= 10} = req.query;
  models.aula
    .findAll({
      //Paginación
      limit: limite,
      offset: (pag - 1) * limite,
      //
      attributes: ["id", "nombre", "tipo", "id_edificio"],
      include:[{as:"Edificio-Relacionado", model:models.edificio, attributes:["id", "Nombre", "direccion"]}]
    })
    .then(aulas => res.send(aulas))
    .catch(() => res.sendStatus(500));
});

/**
 * @swagger
 * /aul:
 *  post:
 *    summary: Crea una nueva aula
 *    tags: [Aula]
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Aula'
 *    responses:
 *      200:
 *        description: Nueva aula creada
 */
router.post("/", (req, res) => {
  models.aula
    .create({ nombre: req.body.nombre, tipo: req.body.tipo, id_edificio: req.body.id_edificio })
    .then(aula => res.status(201).send({ id: aula.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra aula con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAula = (id, { onSuccess, onNotFound, onError }) => {
  models.aula
    .findOne({
      attributes: ["id", "nombre", "tipo", "id_edificio"],
      where: { id }
    })
    .then(aula => (aula ? onSuccess(aula) : onNotFound()))
    .catch(() => onError());
};

/**
 * @swagger
 * /aul/{id}:
 *  get:
 *    summary: Retorna un aula
 *    tags: [Aula]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del aula
 *    responses:
 *      200:
 *        description: Un aula
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Aula'
 *      404:
 *        description: El aula no existe     
 */
router.get("/:id", (req, res) => {
  findAula(req.params.id, {
    onSuccess: aula => res.send(aula),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

/**
 * @swagger
 * /aul/{id}:
 *  put:
 *    summary: Actualiza un aula
 *    tags: [Aula]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del aula
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Aula'
 *    responses:
 *      200:
 *        description: Aula actualizada
 *      404:
 *        description: El aula no existe    
 */
router.put("/:id", (req, res) => {
  const onSuccess = aula =>
    aula
      .update({ nombre: req.body.nombre, tipo: req.body.tipo, id_edificio: req.body.id_edificio}, { fields: ["nombre", "tipo", "id_edificio"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra aula con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findAula(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

/**
 * @swagger
 * /aul/{id}:
 *  delete:
 *    summary: Elimina un aula
 *    tags: [Aula]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del aula
 *    responses:
 *      200:
 *        description: Aula eliminada
 *      404:
 *        description: El aula no existe      
 */
router.delete("/:id", (req, res) => {
  const onSuccess = aula =>
    aula
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAula(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
