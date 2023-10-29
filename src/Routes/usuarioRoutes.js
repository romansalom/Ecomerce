const express = require('express');
const router = express.Router();
const usuarioController = require('../Controllers/Usercontrolers');
// Ruta para obtener todos los productos (GET)

router.post('/post', usuarioController.createUsuario);
router.get('/todos', usuarioController.getallususarios);

module.exports = router;
