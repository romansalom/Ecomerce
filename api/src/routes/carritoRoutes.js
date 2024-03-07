const { Router } = require('express');
const {
  verContenidoCarrito,
  agregarProductoAlCarrito,
  verificarToken,
} = require('../handlers/carritoController'); // Importa el controlador correcto

const router = Router();

// Ruta para obtener el contenido del carrito
router.get('/', verContenidoCarrito);

router.post(
  '/agregar-producto/:productId',
  verificarToken,
  agregarProductoAlCarrito
);

module.exports = router;
