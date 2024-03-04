const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuarios: UserModel } = require('../db');
const { verContenidoCarrito } = require('./carritoController');
const Usuarios = require('../models/Usuarios');

// Función para validar el correo electrónico
function validarCorreoElectronico(email) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
}

// Función para validar la contraseña
function validarContraseña(password) {
  const contraseñaRegex = /^(?=.*[A-Z])(?=.*\d)/; // Debe contener al menos una mayúscula y un número
  return contraseñaRegex.test(password);
}

// Crear un nuevo usuario
const createUsuario = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  try {
    // Validar el correo electrónico
    if (!validarCorreoElectronico(email)) {
      return res.status(400).json({ error: 'Correo electrónico no válido' });
    }

    // Validar la contraseña
    if (!validarContraseña(password)) {
      return res.status(400).json({ error: 'Contraseña no válida' });
    }

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const usuarioExistente = await UserModel.findOne({ where: { email } });
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ error: 'El correo electrónico ya está registrado' });
    }

    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = await UserModel.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
    });

    // Incluir el ID del usuario en la respuesta
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      userId: nuevoUsuario.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.',
    });
  }
};

// Obtener todos los usuarios
const getallususarios = async (req, res) => {
  try {
    const usuarios = await UserModel.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
  }
};

// Iniciar sesión de usuario
const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por correo electrónico
    const usuario = await UserModel.findOne({ where: { email } });
    if (!usuario) {
      return res
        .status(401)
        .json({ error: 'El correo electrónico no está registrado' });
    }

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(password, usuario.password);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar y enviar un token JWT y el ID del usuario si la autenticación es exitosa
    const token = jwt.sign({ id: usuario.id }, 'miSecretoJWT', {});

    // Obtener el contenido del carrito y enviarlo en la respuesta
    const carrito = await verContenidoCarrito(usuario.id);

    res.json({ token, userId: usuario.id, carrito });
    console.log(carrito.dataValues.Productos); // No necesitas imprimirlo aquí
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { createUsuario, iniciarSesion, getallususarios };
