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
            'modelo',
            'flavor',
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
const modificarCantidadProductoEnCarrito = async (req, res) => {
  try {
    const { productId, cantidad } = req.body;
    const userId = req.userId;

    // Buscar el carrito del usuario
    let carrito = await Carrito.findOne({ where: { usuario_id: userId } });

    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Buscar el producto en el carrito
    const carritoProducto = await CarritoProducto.findOne({
      where: { CarritoId: carrito.id, ProductoId: productId },
    });

    if (!carritoProducto) {
      return res
        .status(404)
        .json({ error: 'Producto no encontrado en el carrito' });
    }

    // Obtener el producto
    const producto = await Productos.findByPk(productId);

    // Verificar si la cantidad solicitada es mayor que el stock restante
    if (parseInt(cantidad) > producto.stock) {
      return res
        .status(400)
        .json({ error: 'Cantidad solicitada excede el stock restante' });
    }

    // Calcular la diferencia entre la cantidad actual y la nueva cantidad
    const cantidadAnterior = carritoProducto.cantidad;
    const nuevaCantidad = parseInt(cantidad);
    const diferenciaCantidad = nuevaCantidad - cantidadAnterior;

    // Actualizar la cantidad del producto en el carrito
    carritoProducto.cantidad = nuevaCantidad;
    await carritoProducto.save();

    // Actualizar el stock del producto
    producto.stock -= diferenciaCantidad;
    await producto.save();

    // Obtener el carrito actualizado
    const carritoActualizado = await verContenidoCarrito(userId);

    // Enviar la respuesta con el carrito actualizado
    const productosConCantidad = carritoActualizado.Productos.map(
      (producto) => ({
        ...producto.toJSON(),
        cantidad: producto.CarritoProducto.cantidad,
      })
    );

    res.json(productosConCantidad);
  } catch (error) {
    console.error(
      'Error al modificar la cantidad del producto en el carrito:',
      error
    );
    res.status(500).json({
      error: 'Error al modificar la cantidad del producto en el carrito',
    });
  }
};
const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    // Buscar el carrito del usuario
    let carrito = await Carrito.findOne({ where: { usuario_id: userId } });

    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Buscar el producto en el carrito
    const carritoProducto = await CarritoProducto.findOne({
      where: { CarritoId: carrito.id, ProductoId: productId },
    });

    if (!carritoProducto) {
      return res
        .status(404)
        .json({ error: 'Producto no encontrado en el carrito' });
    }

    // Obtener el producto
    const producto = await Productos.findByPk(productId);

    // Sumar la cantidad del producto eliminado al stock
    producto.stock += carritoProducto.cantidad;
    await producto.save();

    // Eliminar el producto del carrito
    await carritoProducto.destroy();

    // Obtener el carrito actualizado
    const carritoActualizado = await verContenidoCarrito(userId);

    // Enviar la respuesta con el carrito actualizado
    const productosConCantidad = carritoActualizado.Productos.map(
      (producto) => ({
        ...producto.toJSON(),
        cantidad: producto.CarritoProducto.cantidad,
      })
    );

    res.json(productosConCantidad);
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    res.status(500).json({
      error: 'Error al eliminar el producto del carrito',
    });
  }
};
module.exports = {
  verContenidoCarrito,
  agregarProductoAlCarrito,
  verificarToken,
  modificarCantidadProductoEnCarrito,
  eliminarProductoDelCarrito,
};
