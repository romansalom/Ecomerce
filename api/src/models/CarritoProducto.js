const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('CarritoProducto', {
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Valor predeterminado de la cantidad
    },
  });
};
