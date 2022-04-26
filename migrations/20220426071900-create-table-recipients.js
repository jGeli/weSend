'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return  queryInterface.createTable("Recipients", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
      Serial: {
        type: Sequelize.STRING
      },
      Mobtel: {
          type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      msgId: {
        type: Sequelize.STRING
      },
      sentAt: {
            type: Sequelize.DATE,
            defaultValue: null
      },
      createdAt: {
          type: Sequelize.DATE,
          defaultValue: new Date
      },
      isSent: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      messageId: {
        type: Sequelize.INTEGER,
        references: {
            model: "messages",
            key: "id"
          }
        },
    },{
      timestamps: true
    });
  },
 
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Recipients');
  }
};
