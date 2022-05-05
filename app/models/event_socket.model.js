module.exports = (sequelize, Sequelize) => {
    
    const Event_Sockets = sequelize.define("event_sockets", {
      type: {
        type: Sequelize.STRING,
        defaultValue: 'logs'
      },
      description: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Success'
      }
    }, {
      timestamps: true
    });

    return Event_Sockets;
  };

  