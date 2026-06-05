require('dotenv').config()

const user = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const dialect = process.env.DB_DIALECT
const database = process.env.DB_NAME;


module.exports = {
  development: {
    "username": user,
    "password": password,
    "database": database,
    "host": host,
    "dialect": "mysql"
  },
  "test": {
    "username": user,
    "password": password,
    "database": database,
    "host": host,
    "dialect": "mysql"
  },
  "production": {
    "username": user,
    "password": password,
    "database": database,
    "host": host,
    "dialect": "mysql"
  }
}
