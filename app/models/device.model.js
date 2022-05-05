module.exports = (sequelize, Sequelize) => {
    
    const Device = sequelize.define("devices", {
      serial: {
        type: Sequelize.STRING
      },
      mobtel: {
        type: Sequelize.INTEGER
      },
      path: {
        type: Sequelize.STRING
      },
      tag: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Active'
      }
    });

    return Device;
  };

  