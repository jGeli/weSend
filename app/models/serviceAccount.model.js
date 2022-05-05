module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("account", {
      level: {
        type: Sequelize.STRING
      },
      areaCode: {
        type: Sequelize.STRING
      },
      device: {
        type: Sequelize.STRING
      },
      smsReach: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
    return Account;
  };

  