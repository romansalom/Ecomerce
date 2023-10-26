const { DataTypes } = require('sequelize');

module.exports = (database) => {
  database.define('Productos', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marca: {
      type: DataTypes.STRING, // Agregar la propiedad 'marca'
      allowNull: false, // Puedes ajustar esto según tus necesidades
    },
    flavor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    puffs: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING, // Campo para la URL de la imagen
      allowNull: true, // Puedes cambiar esto a false si la imagen es obligatoria
    },
    stock: {
      type: DataTypes.INTEGER, // Agregar la propiedad 'stock'
      allowNull: false, // Puedes ajustar esto según tus necesidades
    },
    precio: {
      type: DataTypes.DOUBLE, // Cambia a DOUBLE si necesitas decimales
      allowNull: false, // Puedes ajustar esto según tus necesidades
    },
  });
};
