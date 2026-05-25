'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('clients', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('clients', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    });
  }
};