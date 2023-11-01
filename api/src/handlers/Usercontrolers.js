const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuarios: UserModel } = require('../db');

// Función para validar el número de teléfono
function validarNumeroDeTelefono(numeroDeTelefono) {
  const telefonoRegex = /^\+\d+$/; // Debe empezar con "+" seguido de uno o más dígitos
  return telefonoRegex.test(numeroDeTelefono);
}

// Función para validar la contraseña
function validarContraseña(password) {
  const contraseñaRegex = /^(?=.*[A-Z])(?=.*\d)/; // Debe contener al menos una mayúscula y un número
  return contraseñaRegex.test(password);
}

const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, numeroDeTelefono, password } = req.body;

    // Validar el número de teléfono
    if (!validarNumeroDeTelefono(numeroDeTelefono)) {
      return res.status(400).json({ error: 'Número de teléfono no válido' });
    }

    // Validar la contraseña
    if (!validarContraseña(password)) {
      return res.status(400).json({ error: 'Contraseña no válida' });
    }

    // Verificar si ya existe un usuario con el mismo número de teléfono
    const usuarioExistente = await UserModel.findOne({
      where: {
        numeroDeTelefono
      }
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El número de teléfono ya está registrado' });
    }

    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Si no existe un usuario con el mismo número de teléfono, crea un nuevo usuario
    const nuevoUsuario = await UserModel.create({
      nombre,
      apellido,
      numeroDeTelefono,
      password: hashedPassword // Guarda la contraseña hasheada
    });

    // Después de crear el usuario, incluye el ID del usuario en la respuesta
    res.json({ message: 'Usuario registrado con éxito', userId: nuevoUsuario.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.' });
  }
};

const getallususarios = async (req, res) => {
  try {
    const usuarios = await UserModel.findAll();

    // Validar el formato del número de teléfono y contraseña de todos los usuarios
    const validUsuarios = usuarios.map((usuario) => {
      const validNumeroDeTelefono = validarNumeroDeTelefono(usuario.numeroDeTelefono);
      const validPassword = validarContraseña(usuario.password);
      return {
        ...usuario.dataValues,
        validNumeroDeTelefono,
        validPassword
      };
    });

    res.json(validUsuarios);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la lista de usuarios');
  }
};

const iniciarSesion = async (req, res) => {
  const { numeroDeTelefono, password } = req.body;

  try {
    // Validar el número de teléfono
    if (!validarNumeroDeTelefono(numeroDeTelefono)) {
      return res.status(400).json({ error: 'Número de teléfono no válido' });
    }

    const usuario = await UserModel.findOne({
      where: {
        numeroDeTelefono
      }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Número de teléfono no registrado' });
    }

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(password, usuario.password);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar y enviar un token JWT y el ID del usuario si la autenticación es exitosa
    const token = jwt.sign({ id: usuario.id }, 'miSecretoJWT', {
      expiresIn: '1h' // Puedes ajustar la duración del token según tus necesidades
    });

    res.json({ token, userId: usuario.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al iniciar sesión');
  }
};

module.exports = {
  createUsuario,
  iniciarSesion,
  getallususarios
};
////