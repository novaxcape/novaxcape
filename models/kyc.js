'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kyc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Kyc.belongsTo(models.Tourist, { foreignKey: 'touristId', as: 'tourist' });
        Kyc.belongsTo(models.Vendor, { foreignKey: 'vendorId', as: 'vendor' });
    }
  }
  Kyc.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    touristId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Tourists',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    lankmark: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CAC: {
      type: DataTypes.STRING,
      allowNull: false
    },
    yearEstablished: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    centreType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postal: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    directorFullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    directorEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    directorPhoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bankCode: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Kyc',
  });
  return Kyc;
};
