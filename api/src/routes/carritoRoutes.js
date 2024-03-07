const { Router } = require('express');
const {
  verContenidoCarrito,
  agregarProductoAlCarrito,
  verificarToken,
} = require('../handlers/carritoController'); // Importa el controlador correcto

const router = Router();

// Ruta para obtener el contenido del carrito
router.get('/', verificarToken, verContenidoCarrito); // Agrega el middleware verificarToken aquí

// Ruta para agregar un producto al carrito
router.post(
  '/agregar-producto/:productId/:cantidad', // Agrega el parámetro de cantidad a la ruta
  verificarToken,
  agregarProductoAlCarrito
);

module.exports = router;
