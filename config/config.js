require('dotenv').config()

const host_user = process.env.HOST_DB_USERNAME
const host_password = process.env.HOST_DB_PASSWORD
const host_host = process.env.HOST_DB_HOST
const host_dialect = process.env.HOST_DB_DIALECT
const host_database = process.env.HOST_DB_NAME;

const local_user = process.env.LOCAL_DB_USERNAME
const local_password = process.env.LOCAL_DB_PASSWORD
const local_host = process.env.LOCAL_DB_HOST
const local_dialect = process.env.LOCAL_DB_DIALECT
const local_database = process.env.LOCAL_DB_NAME;


module.exports = {
  development: {
    "username": local_user,
    "password": local_password,
    "database": local_database,
    "host": local_host,
    "dialect": local_dialect
  },
  "test": {
    "username": host_user,
    "password": host_password,
    "database": host_database,
    "host": host_host,
    "dialect": host_dialect
  },
  "production": {
    "username": host_user,
    "password": host_password,
    "database": host_database,
    "host": host_host,
    "dialect": host_dialect
  }
}
