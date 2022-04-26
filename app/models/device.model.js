module.exports = (sequelize, Sequelize) => {
    
    const Device = sequelize.define("Devices", {
      serial: {
        type: Sequelize.STRING
      },
      path: {
        type: Sequelize.STRING
      },
      isBusy: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });

    return Device;
  };

  