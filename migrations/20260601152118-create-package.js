'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Packages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      packageName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      packageType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      numberOfPeople: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('Packages');
  }
};