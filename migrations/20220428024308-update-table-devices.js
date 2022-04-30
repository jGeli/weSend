'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Devices', 'number', { type: Sequelize.STRING });
    },
  
    async down (queryInterface, Sequelize) {
      return queryInterface.removeColumn('Devices', 'number');
    }
};
