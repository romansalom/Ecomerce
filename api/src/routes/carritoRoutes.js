const { Router } = require('express');
const {
  verContenidoCarrito,
  agregarProductoAlCarrito,
} = require('../handlers/carritoController'); // Importa el controlador correcto

const router = Router();

// Ruta para obtener el contenido del carrito
router.get('/', verContenidoCarrito);

router.post('/agregar-producto/:productId', agregarProductoAlCarrito); // Corrige el nombre del controlador

module.exports = router;
