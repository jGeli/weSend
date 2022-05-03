'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS simpaks (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        description TEXT NULL DEFAULT NULL,
        mobtel VARCHAR(10) NULL DEFAULT NULL,
        path VARCHAR(100) NULL DEFAULT NULL,
        tag VARCHAR(100) NULL DEFAULT NULL,
        status VARCHAR(30) NULL DEFAULT 'ACTIVE',
        PRIMARY KEY (id));
        `, { transaction: t })
    ])
    
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query(`
        DROP TABLE EXISTS simpaks;
        `, { transaction: t })
    ])
  }
};
