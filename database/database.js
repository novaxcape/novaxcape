const { Sequelize } = require('sequelize')
require('dotenv').config()

let database, user, password, host, dialect;


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

if (process.env.NODE_ENV === 'production') {
  database = host_database;
  user = host_user;
  password = host_password;
  dialect = host_dialect;
  host = host_host
} else {
  database = local_database;
  user = local_user;
  password = local_password;
  dialect = local_dialect;
  host = local_host
};

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: dialect
});

module.exports = sequelize