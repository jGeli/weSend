'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
      queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS simpaks (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        description TEXT NULL DEFAULT NULL,
        mobtel VARCHAR(15) NULL DEFAULT NULL,
        sentCount INT NOT NULL DEFAULT 0,
        errorCount INT NOT NULL DEFAULT 0,
        status VARCHAR(30) NULL DEFAULT 'ACTIVE',
        PRIMARY KEY (id));
        `, { transaction: t })
    ])
  })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
      queryInterface.sequelize.query(`
        DROP TABLE EXISTS simpaks;
        `, { transaction: t })
    ])
  })
  }
};
