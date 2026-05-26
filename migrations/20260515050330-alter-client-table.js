'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add password column
    await queryInterface.addColumn('clients', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Change phoneNumber from INTEGER to STRING
    await queryInterface.changeColumn('clients', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove password column
    await queryInterface.removeColumn('clients', 'password');

    // Change phoneNumber back to INTEGER
    await queryInterface.changeColumn('clients', 'phoneNumber', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
