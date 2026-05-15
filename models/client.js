'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  client.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING, // Changed to STRING
    age: DataTypes.INTEGER,
    gender: DataTypes.ENUM('Male', 'Female'),
    password: DataTypes.STRING, // Added password field
    otp: DataTypes.STRING,
    profilePicture: DataTypes.TEXT,
    role: DataTypes.ENUM('User', 'Admin'),
    otpExpire: DataTypes.DATE,
    isVerified: DataTypes.BOOLEAN,
    userName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'client',
  });
  return client;
};