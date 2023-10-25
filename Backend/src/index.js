const express = require('express');
const { database } = require('./db');
const productoRoutes = require('../src/Routes/productoRoutes'); // Asegúrate de utilizar la ruta correcta

database.sync({force : true});

const app = express();
const PORT = 3001;

// Middleware para permitir el uso de JSON en las solicitudes POST
app.use(express.json());

// Rutas para los productos
app.use('/api/productos', productoRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
