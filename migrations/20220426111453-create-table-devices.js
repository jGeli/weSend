'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Devices',{
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true // Automatically gets converted to SERIAL for postgres
      },
      serial: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      isBusy: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    }, {
      timestamps: true
    });
    },
  
    async down (queryInterface, Sequelize) {
      return queryInterface.dropTable('Devices');
    }
};
