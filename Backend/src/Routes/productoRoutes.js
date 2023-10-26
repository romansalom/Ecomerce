const express = require('express');
const productoController = require('../Controllers/productoController');
const router = express.Router();

// Ruta para obtener todos los productos (GET)
router.get('/todos', productoController.getAllProductos);

// Rutas para crear un nuevo producto (POST)
router.post('/post', productoController.createProducto);

//Ruta para agregar múltiples productos
router.post('/agregar-multiples', productoController.createMultipleProductos);

module.exports = router;
