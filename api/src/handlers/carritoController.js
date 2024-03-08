const { Carrito, Productos, CarritoProducto } = require('../db');
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token, 'miSecretoJWT');
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

const verContenidoCarrito = async (userId) => {
  try {
    const carrito = await Carrito.findOne({
      where: { usuario_id: userId },
      include: [
        {
          model: Productos,
          through: 'CarritoProducto',
          attributes: [
            'id',
            'name',
            'marca',
            'puffs',
            'precio',
            'stock',
            'imageUrl',
          ],
        },
      ],
    });

    return carrito;
  } catch (error) {
    console.error('Error al obtener el contenido del carrito:', error);
    throw error;
  }
};

const agregarProductoAlCarrito = async (req, res) => {
  const { productId, cantidad } = req.params;
  const producto = await Productos.findByPk(productId);

  try {
    const userId = req.userId;

    let carrito = await Carrito.findOne({ where: { usuario_id: userId } });

    if (!carrito) {
      carrito = await Carrito.create({ userId: userId });
    }

    let existeProducto = await CarritoProducto.findOne({
      where: { CarritoId: carrito.id, ProductoId: productId },
    });

    if (existeProducto) {
      existeProducto.cantidad += parseInt(cantidad);
      await existeProducto.save();
    } else {
      await CarritoProducto.create({
        CarritoId: carrito.id,
        ProductoId: productId,
        cantidad: parseInt(cantidad),
      });
    }

    producto.stock -= parseInt(cantidad);
    await producto.save();

    const carritoActualizado = await verContenidoCarrito(userId);

    const productosConCantidad = carritoActualizado.Productos.map(
      (producto) => ({
        ...producto.toJSON(),
        cantidad: producto.CarritoProducto.cantidad,
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
