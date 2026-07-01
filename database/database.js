const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize({
  username: process.env.HOST_DB_USERNAME,
  password: process.env.HOST_DB_PASSWORD,
  database: process.env.HOST_DB_NAME,
  host: process.env.HOST_DB_HOST,
  dialect: 'mysql',
  logging: console.log // Enable logging to see SQL queries
});

module.exports = sequelize
