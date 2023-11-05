const express = require('express');
const router = express.Router();

//Controlador
const AuthController = require('./controllers/AuthController');

/**
 * @swagger
 * components:
 *  schemas:
 *    Usuario:
 *      type: object
 *      required:
 *        - nombre
 *        - contraseña
 *        - numLegajo
 *      properties:
 *        nombre:
 *          type: string
 *          description: Nombre del usuario
 *        contraseña:
 *          type: string
 *          description: Contraseña del usuario
 *        numLegajo:
 *          type: integer
 *          description: Numero de legajo
 *      example:
 *        nombre: Roberto Carlos
 *        contraseña: 123456789
 *        numLegajo: 44445555
 */

//Login
/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Ingresa usuario
 *    tags: [Usuario]
 *    requestBody: 
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Usuario'
 *    responses:
 *      200:
 *        description: Ingresa usuario al sistema
 */
router.post('/login', AuthController.login);

//Registro
/**
 * @swagger
 * /auth/registrar:
 *  post:
 *    summary: Crea nuevo usuario
 *    tags: [Usuario]
 *    requestBody: 
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Usuario'
 *    responses:
 *      200:
 *        description: Crea nuevo usuario
 */
router.post('/registrar', AuthController.registrar);

module.exports = router;