const { DataTypes } = require('sequelize');

module.exports = (database) => {
   database.define('Usuarios', {
    nombre: {
      type: DataTypes.STRING, // Campo para el nombre
      allowNull: false, // No permite valores nulos
    },
    apellido: {
      type: DataTypes.STRING, // Campo para el apellido
      allowNull: false, // No permite valores nulos
    },
    numeroDeTelefono: {
      type: DataTypes.STRING, // Campo para el número de teléfono
    },
    // Otros campos de usuario que necesites
  });


};
