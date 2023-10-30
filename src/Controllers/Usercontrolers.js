const { database } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, numeroDeTelefono, password } = req.body;
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

    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Si no existe un usuario con el mismo número de teléfono, crea un nuevo usuario
    const nuevoUsuario = await Usuarios.create({
      nombre,
      apellido,
      numeroDeTelefono,
      password: hashedPassword // Guarda la contraseña hasheada
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el usuario');
  }
};

const iniciarSesion = async (req, res) => {
  const { numeroDeTelefono, password } = req.body;
  const Usuarios = database.models.Usuarios;

  try {
    const usuario = await Usuarios.findOne({
      where: {
        numeroDeTelefono
      }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(password, usuario.password);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar y enviar un token JWT si la autenticación es exitosa
    const token = jwt.sign({ id: usuario.id }, 'miSecretoJWT', {
      expiresIn: '1h' // Puedes ajustar la duración del token según tus necesidades
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al iniciar sesión');
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
  iniciarSesion,
  getallususarios
};
