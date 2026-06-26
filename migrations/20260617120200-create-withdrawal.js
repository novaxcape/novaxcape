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

      walletId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Wallets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
    amount: {
        type: Sequelize.INTEGER
        },
    reference: {
        type: Sequelize.STRING,
        unique: true
        },
    bankName: {
        type: Sequelize.STRING
        },
        bankCode: {
            type: Sequelize.STRING
        },
    providerReference: {
        type: Sequelize.STRING
       },

    accountNumber: {
        type: Sequelize.STRING
        },
    status: {
        type: Sequelize.ENUM("processing", "successful", "failed"),
        defaultValue: "processing"
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