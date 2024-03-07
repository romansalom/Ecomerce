const { Router } = require('express');
const cors = require('cors'); // Importa el middleware de CORS
const productoRoutes = require('../routes/productoRoutes'); // Asegúrate de utilizar la ruta correcta
const usuariosRoutes = require('../routes/usuarioRoutes');
const carritoRoutes = require('../routes/carritoRoutes');

const router = Router();

// Habilitar CORS para todas las solicitudes
router.use(cors());

// Configurar los routers
router.use('/api/productos', productoRoutes);
router.use('/api/users', usuariosRoutes);
router.use('/api/carritos', carritoRoutes);

module.exports = router;
