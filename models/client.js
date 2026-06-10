'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        Client.hasMany(models.Booking, { foreignKey: 'clientId', as: 'bookings'});
    }
  }
  Client.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profilePicture: [{
      type: DataTypes.STRING,
      get() {
        const value = this.getDataValue('profilePicture');
        return value ? JSON.parse(value): [];
      },

      set(val) {
        this.setDataValue('profilePicture', JSON.stringify(val));
      }
    }],
    profilePicturePublicUrl: [{
      type: DataTypes.STRING,
      get() {
        const value = this.getDataValue('profilePicturePublicUrl');
        return value ? JSON.parse(value): [];
      },

      set(val) {
        this.setDataValue('profilePicturePublicUrl', JSON.stringify(val));
      }
    }],
    role: {
      type: DataTypes.STRING,
      defaultValue: "Client"
    },
    otpExpire: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: () => new Date(Date.now() + 1000 * 60 * 5)
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userName: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
  });
  return Client;
};
