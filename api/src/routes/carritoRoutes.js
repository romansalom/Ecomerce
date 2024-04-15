const { Router } = require('express');
const {
  verContenidoCarrito,
  agregarProductoAlCarrito,
  modificarCantidadProductoEnCarrito,
  eliminarProductoDelCarrito, // Importa la función para eliminar productos del carrito
  verificarToken,
} = require('../handlers/carritoController');

const router = Router();

// Ruta para obtener el contenido del carrito
router.get('/carrito/', verificarToken, async (req, res) => {
  try {
    const userId = req.userId;
    const carrito = await verContenidoCarrito(userId);
    res.json(carrito);
  } catch (error) {
    console.error('Error al obtener el contenido del carrito:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener el contenido del carrito' });
  }
});

// Ruta para agregar un producto al carrito
router.post(
  '/agregar-producto/:productId/:cantidad',
  verificarToken,
  agregarProductoAlCarrito
);

// Ruta para modificar la cantidad de un producto en el carrito
router.put(
  '/modificar-cantidad/',
  verificarToken,
  modificarCantidadProductoEnCarrito
);

// Ruta para eliminar un producto del carrito
router.delete(
  '/eliminar-producto/:productId', // Define el endpoint para eliminar productos del carrito
  verificarToken,
  eliminarProductoDelCarrito
);

module.exports = router;
