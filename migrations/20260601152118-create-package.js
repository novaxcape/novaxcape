'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // No-op migration created to satisfy missing migration reference.
    return Promise.resolve();
  },
  async down(queryInterface, Sequelize) {
    // No-op down
    return Promise.resolve();
  }
};
