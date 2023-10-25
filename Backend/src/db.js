const { Sequelize } = require('sequelize');
require('dotenv').config(); 
const { DB_USER , DB_NAME ,DB_HOST,DB_PASSWORD} = process.env
const ProductosModel = require('./Models/ProductosModel');


const database = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);

ProductosModel(database)
module.exports = {database}