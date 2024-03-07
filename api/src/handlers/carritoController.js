const { Carrito, Productos, CarritoProducto } = require('../db');
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization; // Así es como podrías enviar el token en el encabezado Authorization: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token, 'miSecretoJWT');
    req.userId = decoded.id; // Agregar userId al objeto req para que esté disponible en las rutas posteriores
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Obtener el contenido del carrito del usuario logeado
// Obtener el contenido del carrito del usuario logeado
const verContenidoCarrito = async (userId) => {
  try {
    // Buscar el carrito asociado al usuario
    const carrito = await Carrito.findOne({
      where: { usuario_id: userId }, // Corregir aquí
      include: [
        {
          model: Productos,
          through: 'CarritoProducto',
          attributes: ['id', 'name', 'marca', 'puffs', 'precio', 'stock'], // Especificar los atributos que deseas devolver
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
  const { cantidad } = req.body;
  const { productId } = req.params; // Obtener el productId de los parámetros de la solicitud
  const producto = await Productos.findByPk(productId);

  try {
    const userId = req.userId; // Obtener userId del middleware verificarToken

    // Verificar si el usuario tiene un carrito existente
    // Verificar si el usuario tiene un carrito existente
    let carrito = await Carrito.findOne({ where: { usuario_id: userId } });

    // Si no hay un carrito existente, crear uno nuevo para el usuario
    if (!carrito) {
      carrito = await Carrito.create({ userId: userId });
    }

    // Verificar si el producto ya está en el carrito del usuario
    let existeProducto = await CarritoProducto.findOne({
      where: { CarritoId: carrito.id, ProductoId: productId },
    });

    if (existeProducto) {
      // Si el producto ya está en el carrito, actualizar la cantidad
      existeProducto.cantidad += cantidad; // Incrementar la cantidad existente en el carrito
      await existeProducto.save();
    } else {
      // Si el producto no está en el carrito, agregarlo con la cantidad enviada
      await CarritoProducto.create({
        CarritoId: carrito.id,
        ProductoId: productId,
        cantidad: cantidad, // Agregar la cantidad enviada
      });
    }

    // Restar la cantidad seleccionada del stock general del producto
    producto.stock -= cantidad;
    await producto.save();

    // Devolver el carrito actualizado con la información del producto
    const carritoActualizado = await verContenidoCarrito(userId);

    // Devolver la información del producto con la cantidad total en el carrito
    const productosConCantidad = carritoActualizado.Productos.map(
      (producto) => ({
        ...producto.toJSON(),
        cantidad: producto.CarritoProducto.cantidad, // Utilizar la cantidad en el carrito
      })
    );

    res.json(productosConCantidad);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};

module.exports = {
  verContenidoCarrito,
  agregarProductoAlCarrito,
  verificarToken,
};
