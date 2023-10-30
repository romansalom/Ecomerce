const { DataTypes } = require('sequelize');

module.exports = (database) => {
  database.define('Usuarios', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numeroDeTelefono: {
      type: DataTypes.STRING,
      unique: true, // Asegura que el número de teléfono sea único
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING, // Campo para la contraseña
      allowNull: false,
    },
  });
};

