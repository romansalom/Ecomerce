const { sequelize } = require('../db');
const { Productos: ProductosModel } = require('../db');

// Función para obtener todos los productos
// Función para obtener todos los productos o un producto por su ID si se especifica
const getAllProductos = async (req, res) => {
  const { id } = req.query; // Obtén el ID del producto de la consulta (si está presente)

  try {
    if (id) {
      // Si se proporciona un ID, busca el producto por ese ID
      const producto = await ProductosModel.findByPk(id);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      return res.json(producto);
    } else {
      // Si no se proporciona un ID, obtén todos los productos
      const productos = await ProductosModel.findAll();
      return res.json(productos);
    }
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Función para crear un nuevo producto
const createProducto = async (req, res) => {
  const { name, flavor, puffs, imageUrl, stock, precio, marca, modelo } =
    req.body;

  try {
    // Validación: Comprueba si ya existe un producto con el mismo nombre, cantidad de puffs y precio
    const productoExistente = await ProductosModel.findOne({
      where: {
        name,
        puffs,
        precio,
        marca,
        modelo,
      },
    });

    if (productoExistente) {
      return res.status(400).json({
        error:
          'Producto con el mismo nombre, cantidad de puff y precio ya existe',
      });
    }

    // Si no existe un producto con los mismos datos, crea un nuevo producto
    const nuevoProducto = await ProductosModel.create({
      name,
      flavor,
      puffs,
      imageUrl,
      stock,
      precio,
      marca,
      modelo,
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear un producto:', error);
    res.status(500).json({ error: 'Error al crear un producto' });
  }
};

// Función para crear múltiples productos
const createMultipleProductos = async (req, res) => {
  const productosData = req.body;

  try {
    const uniqueProducts = [];
    const duplicateProducts = [];

    for (const producto of productosData) {
      const productoExistente = await ProductosModel.findOne({
        where: {
          name: producto.name,
          puffs: producto.puffs,
          precio: producto.precio,
        },
      });

      if (productoExistente) {
        duplicateProducts.push(producto);
      } else {
        uniqueProducts.push(producto);
      }
    }

    if (uniqueProducts.length > 0) {
      const nuevosProductos = await ProductosModel.bulkCreate(uniqueProducts);
      res
        .status(201)
        .json({ created: nuevosProductos, duplicates: duplicateProducts });
    } else {
      res.status(400).json({
        error: 'Todos los productos son duplicados',
        duplicates: duplicateProducts,
      });
    }
  } catch (error) {
    console.error('Error al crear múltiples productos:', error);
    res.status(500).json({ error: 'Error al crear múltiples productos' });
  }
};

module.exports = {
  getAllProductos,
  createProducto,
  createMultipleProductos,
};
