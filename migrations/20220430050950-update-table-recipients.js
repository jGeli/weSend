'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('recipients', 'path', { type: Sequelize.STRING });
    },
  
    async down (queryInterface, Sequelize) {
      return queryInterface.removeColumn('recipients', 'path');
    }
};
