const { Sequelize } = require('sequelize')
require('dotenv').config()

const user = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const dialect = process.env.DB_DIALECT
const database = process.env.DB_NAME;

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: dialect
});

module.exports = sequelize