var express = require("express");
var router = express.Router();
var models = require("../models");

/**
 * @swagger
 * components:
 *  schemas:
 *    Materia:
 *      type: object
 *      required:
 *        - nombre
 *      properties:
 *        nombre:
 *          type: string
 *          description: Nombre de materia
 *      example:
 *        nombre: Estrategias de persistencia
 */

/**
 * @swagger
 * /mat:
 *  get:
 *    summary: Retorna todas las materias
 *    tags: [Materia]
 *    responses:
 *      200:
 *        description: Todas las materias
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Materia'       
 */
router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.materia
    .findAll({
      attributes: ["id", "nombre", "id_carrera"]
    })
    .then(materias => res.send(materias))
    .catch(() => res.sendStatus(500));
});

/**
 * @swagger
 * /mat:
 *  post:
 *    summary: Crea una nueva materia
 *    tags: [Materia]
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Materia'
 *    responses:
 *      200:
 *        description: Nueva materia creada
 */
router.post("/", (req, res) => {
  models.materia
    .create({ nombre: req.body.nombre, id_carrera: req.body.id_carrera })
    .then(materia => res.status(201).send({ id: materia.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra materia con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre", "id_carrera"],
      where: { id }
    })
    .then(materia => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

/**
 * @swagger
 * /mat/{id}:
 *  get:
 *    summary: Retorna una materia
 *    tags: [Materia]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id de la materia
 *    responses:
 *      200:
 *        description: Una materia
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Materia'
 *      404:
 *        description: La materia no existe     
 */
router.get("/:id", (req, res) => {
  findMateria(req.params.id, {
    onSuccess: materia => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

/**
 * @swagger
 * /mat/{id}:
 *  put:
 *    summary: Actualiza una materia
 *    tags: [Materia]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id de la materia
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Materia'
 *    responses:
 *      200:
 *        description: Materia actualizada
 *      404:
 *        description: La materia no existe    
 */
router.put("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .update({ nombre: req.body.nombre, id_carrera: req.body.id_carrera}, { fields: ["nombre", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra materia con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

/**
 * @swagger
 * /mat/{id}:
 *  delete:
 *    summary: Elimina una materia
 *    tags: [Materia]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id de la materia
 *    responses:
 *      200:
 *        description: Materia eliminada
 *      404:
 *        description: La materia no existe      
 */
router.delete("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
