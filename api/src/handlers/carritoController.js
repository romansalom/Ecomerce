const { Carrito, Productos, CarritoProducto } = require('../db');

// Obtener el contenido del carrito del usuario logeado
const verContenidoCarrito = async (userId) => {
  try {
    // Buscar el carrito asociado al usuario
    const carrito = await Carrito.findOne({
      where: { usuario_id: userId },
      include: [
        {
          model: Productos,
          through: 'CarritoProducto',
          attributes: ['id', 'name', 'marca', 'puffs', 'precio'], // Especificar los atributos que deseas devolver
        },
      ],
    });

    return carrito;
  } catch (error) {
    console.error('Error al obtener el contenido del carrito:', error);
    throw error; // Lanza el error para manejarlo en otro lugar si es necesario
  }
};

const agregarProductoAlCarrito = async (req, res) => {
  const { userId, cantidad } = req.body;
  const { productId, stock } = req.params; // Obtener el productId de los parámetros de la solicitud

  try {
    // Verificar si el usuario tiene un carrito existente
    let carrito = await Carrito.findOne({ where: { usuario_id: userId } });

    // Si no hay un carrito existente, crear uno nuevo para el usuario
    if (!carrito) {
      carrito = await Carrito.create({ usuario_id: userId });
    }

    // Verificar si el producto ya está en el carrito del usuario
    let existeProducto = await CarritoProducto.findOne({
      where: { CarritoId: carrito.id, ProductoId: productId },
    });

    if (existeProducto) {
      // Si el producto ya está en el carrito, actualizar la stock
      existeProducto.stock += stock;
      await existeProducto.save();
    } else {
      // Si el producto no está en el carrito, agregarlo
      await CarritoProducto.create({
        CarritoId: carrito.id,
        ProductoId: productId,
        stock: stock,
      });
    }

    // Devolver el carrito actualizado
    const carritoActualizado = await verContenidoCarrito(userId);

    res.json(carritoActualizado.Productos);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};

module.exports = { verContenidoCarrito, agregarProductoAlCarrito };
