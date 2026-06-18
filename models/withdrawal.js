'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Withdrawal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Withdrawal.belongsTo(models.Tourist, { foreignKey: 'touristId', as: 'tourist' });
      Withdrawal.belongsTo(models.Wallet, { foreignKey: 'walletId', as: 'wallet' });
    }
  }
  Withdrawal.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        dafaultValue: DataTypes.UUIDV4
      },

      touristId: {
        allowNull:false,
        type: DataTypes.UUID,
        references: {
          model: 'Tourists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      walletId: {
        allowNull: true,
        type: DataTypes.UUID,
        references: {
          model: 'Wallets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      destinationType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "bank_account",
      },

      amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      bankCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      customerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      bankCountry: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      bankName: {
        type: DataTypes.STRING,
        allowNull: true,
      },


      beneficiaryType: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      accountType: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      accountNumberType: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      routingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      intermediaryRoutingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      addressInformation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      supportingDocuments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      narration: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      purposeOfPayment: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      metadata: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

  }, {
    sequelize,
    modelName: 'Withdrawal',
  });
  return Withdrawal;
};
