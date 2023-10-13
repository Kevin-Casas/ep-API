const express = require('express');
const router = express.Router();

//Controlador
const AuthController = require('./controllers/AuthController');

//Home
router.get('/', (req, res) => res.json({hello: 'Login de usuario UNAHUR'}));

//Login
router.post('/api/login', AuthController.login);

//Registro
router.post('/api/registrar', AuthController.registrar);

module.exports = router;