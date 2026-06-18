'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Withdrawals', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        dafaultValue: Sequelize.UUIDV4
      },

      touristId: {
        allowNull:false,
        type: Sequelize.UUID,
        references: {
          model: 'Tourists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      destinationType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "bank_account",
      },

      amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      bankCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      customerEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      customerName: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      bankCountry: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      bankName: {
        type: Sequelize.STRING,
        allowNull: true,
      },


      beneficiaryType: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      accountType: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      accountNumberType: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      routingNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      intermediaryRoutingNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      addressInformation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      supportingDocuments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      narration: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      purposeOfPayment: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      metadata: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Withdrawals');
  }
};