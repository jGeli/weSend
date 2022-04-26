module.exports = (sequelize, Sequelize) => {
    const Mobtel = sequelize.define("Mobtels", {
      Mobtel: {
        type: Sequelize.STRING
      },
      Serial: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      network: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.STRING
      },
      long: {
        type: Sequelize.STRING
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  
    return Mobtel;
  };

  