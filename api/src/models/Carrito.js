// En el archivo models/Carrito.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Carrito', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Puedes agregar más campos según tus necesidades, por ejemplo:
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'activo', // Estado por defecto del carrito
    },
    // Puedes agregar más campos como fecha de creación, fecha de actualización, etc.
  });
};
