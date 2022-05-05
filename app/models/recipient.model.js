module.exports = (sequelize, Sequelize) => {
    const Recipient = sequelize.define("recipients", {
      Serial: {
        type: Sequelize.STRING
      },
      Mobtel: {
          type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      path: {
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
    });
    return Recipient;
  };

  