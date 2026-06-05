'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // phoneNumber is already STRING in the original migration
    // No changes needed
  },

  async down(queryInterface, Sequelize) {
    // No-op for down migration
  }
};
