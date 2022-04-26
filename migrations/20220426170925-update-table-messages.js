'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Messages', 'userId', { type: Sequelize.INTEGER });
    },
  
    async down (queryInterface, Sequelize) {
      return queryInterface.dropTable('Messages');
    }
};
