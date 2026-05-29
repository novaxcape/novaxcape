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
        client.hasMany(models.Booking, { foreignKey: 'clientId', as: 'bookings'});
    }
  }
  client.init({
    id: {
       allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profilePicture: DataTypes.TEXT,
    role: DataTypes.BOOLEAN,
    otpExpire: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isVerified: DataTypes.BOOLEAN,
    isLocked: DataTypes.BOOLEAN,
    failedLoginAttempts: DataTypes.INTEGER,
    userName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'clients',
  });
  return client;
};
