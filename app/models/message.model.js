module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("Messages", {
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
      },
      userId: {
        type: Sequelize.INTEGER
      }
    });
  
    return Message;
  };

  