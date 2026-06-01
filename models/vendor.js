'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vendor.init({
    id: {
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    centerName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'Vendor'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otpExpire: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: () => new Date(Date.now() + 1000 * 60 * 5)
    }
  }, {
    sequelize,
    modelName: 'Vendor',
  });
  return Vendor;
};
