'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Kycs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      touristId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Tourists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      lankmark: {
        type: Sequelize.STRING,
        allowNull: false
      },
      CAC: {
        type: Sequelize.STRING,
        allowNull: false
      },
      yearEstablished: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      centreType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      postal: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      directorFullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      directorEmail: {
        type: Sequelize.STRING,
        allowNull: false
      },
      directorPhoneNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accountNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      accountName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bankCode: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('Kycs');
  }
};