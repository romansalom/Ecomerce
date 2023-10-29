const express = require('express');
const { database } = require('./db');
const productoRoutes = require('../src/Routes/productoRoutes'); // Asegúrate de utilizar la ruta correcta
const usuariosRoutes = require('../src/Routes/usuarioRoutes')

const cors = require('cors');
database.sync({force : true});

const app = express();
const PORT = 3001;
app.use(cors());
// Middleware para permitir el uso de JSON en las solicitudes POST
app.use(express.json());

// Rutas para los productos
app.use('/api/productos', productoRoutes);

// Rutas para los usuarios
app.use('/api/users', usuariosRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
