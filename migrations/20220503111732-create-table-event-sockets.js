'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
      queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS event_sockets (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        description TEXT NULL DEFAULT NULL,
        content TEXT NULL DEFAULT NULL,
        type VARCHAR(30) NOT NULL DEFAULT 'logs', 
         createdAt DATETIME NOT NULL,
         updatedAt DATETIME NOT NULL,
        PRIMARY KEY (id));
        `, { transaction: t })
    ])
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
    return Promise.all([
      queryInterface.sequelize.query(`
        DROP TABLE EXISTS event_sockets;
        `, { transaction: t })
    ])
  })
  }
};
