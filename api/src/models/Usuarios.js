const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Usuarios', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true, // Asegura que el correo electrónico sea único
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING, // Campo para la contraseña
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
  });
};
