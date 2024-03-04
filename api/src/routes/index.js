const { Router } = require('express');
const productoRoutes = require('../routes/productoRoutes'); // Asegúrate de utilizar la ruta correcta
const usuariosRoutes = require('../routes/usuarioRoutes');
const carritoRoutes = require('../routes/carritoRoutes');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/api/productos', productoRoutes);

// Rutas para los usuarios
router.use('/api/users', usuariosRoutes);

router.use('/api/carritos', carritoRoutes);

module.exports = router;
