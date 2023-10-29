const { database } = require('../db');

const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, numeroDeTelefono } = req.body;
    const Usuarios = database.models.Usuarios;

    // Verificar si ya existe un usuario con el mismo número de teléfono
    const usuarioExistente = await Usuarios.findOne({
      where: {
        numeroDeTelefono
      }
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este número de teléfono ya está registrado' });
    }

    // Si no existe un usuario con el mismo número de teléfono, crea un nuevo usuario
    const nuevoUsuario = await Usuarios.create({
      nombre,
      apellido,
      numeroDeTelefono
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el usuario');
  }
};
const getallususarios =  async (req, res) => {
    try {
      const Usuarios = database.models.Usuarios;
      const usuarios = await Usuarios.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener la lista de usuarios');
    }
  };

module.exports = {
  createUsuario,
  getallususarios
};
