const express = require('express');
const router = express.Router();
const usuarioController = require('../handlers/Usercontrolers');

// Ruta para crear un nuevo usuario (POST)
router.post('/post', usuarioController.createUsuario);

// Ruta para obtener todos los usuarios (GET)
router.get('/todos', usuarioController.getallususarios);

// Ruta para iniciar sesión y obtener un token JWT (POST)
router.post('/inicio-sesion', usuarioController.iniciarSesion);

module.exports = router;
