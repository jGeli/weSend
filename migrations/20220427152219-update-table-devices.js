'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.addColumn('Devices', 'isError', { type: Sequelize.BOOLEAN, defaultValue: false });
    },
  
    async down (queryInterface, Sequelize) {
      return queryInterface.dropTable('Devices');
    }
};
