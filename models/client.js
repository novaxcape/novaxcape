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
      defaultValue: DataTypes.UUIDV4
    },
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.ENUM('Male', 'Female'),
    otp: DataTypes.STRING,
    profilePicture: DataTypes.TEXT,
    role: DataTypes.STRING,
    otpExpire: DataTypes.DATE,
    isVerified: DataTypes.BOOLEAN,
    userName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'client',
  });
  return client;
};