'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Messages',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    content: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    isFlash: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isCompleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isProcessing: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    startAt: {
      type: Sequelize.INTEGER,
      defaulValue: 0
    },
    totalSent: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true
  });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Messages');
  }
};
