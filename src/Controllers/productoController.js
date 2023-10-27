const { database } = require('../db'); 

// Función para obtener todos los productos lol

const getAllProductos = async (req, res) => {
  try {
    const Productos = database.models.Productos;
    const productos = await Productos.findAll();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Función para crear un nuevo producto
const createProducto = async (req, res) => {
  const { name, flavor, puffs, imageUrl, stock, precio,marca,modelo } = req.body; // Incluye 'stock' y 'precio' en la desestructuración
  try {
    const Productos = database.models.Productos;

    // Validación: Comprueba si ya existe un producto con el mismo nombre, cantidad de puffs y precio
    const productoExistente = await Productos.findOne({
      where: {
        name,
        puffs,
        precio,
        marca,
        modelo
      },
    });

    if (productoExistente) {
      return res.status(400).json({ error: 'Producto con el mismo nombre, cantidad de puff y precio ya existe' });
    }

    // Si no existe un producto con los mismos datos, crea un nuevo producto
    const nuevoProducto = await Productos.create({
      name,
      flavor,
      puffs,
      imageUrl,
      stock,
      precio, 
      marca,
      modelo// Agrega 'precio' al objeto que se crea en la base de datos
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear un producto:', error);
    res.status(500).json({ error: 'Error al crear un producto' });
  }
};

const createMultipleProductos = async (req, res) => {
  const productosData = req.body; // Debes enviar un arreglo de productos en el cuerpo de la solicitud
  try {
    const Productos = database.models.Productos;

    // Arreglos para almacenar productos únicos y productos duplicados
    const uniqueProducts = [];
    const duplicateProducts = [];

    for (const producto of productosData) {
      const productoExistente = await Productos.findOne({
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
      // Si hay productos únicos, crea y devuelve los nuevos productos únicos
      const nuevosProductos = await Productos.bulkCreate(uniqueProducts);
      res.status(201).json({ created: nuevosProductos, duplicates: duplicateProducts });
    } else {
      // Si no hay productos únicos, devuelve una respuesta indicando que todos son duplicados
      res.status(400).json({ error: 'Todos los productos son duplicados', duplicates: duplicateProducts });
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
