'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return  queryInterface.createTable( "Mobtels", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
      Mobtel: {
        type: Sequelize.STRING
      },
      Serial: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      network: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.STRING
      },
      long: {
        type: Sequelize.STRING
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    },{
      timestamps: true
    });
  },
 
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Mobtels');
  }
};
