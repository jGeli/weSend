'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Devices', 'path', { type: Sequelize.STRING });
    },
  
    async down (queryInterface, Sequelize) {
      return queryInterface.dropTable('Devices');
    }
};
