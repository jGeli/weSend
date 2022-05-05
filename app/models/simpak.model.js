module.exports = (sequelize, Sequelize) => {
    
    const Simpak = sequelize.define("simpak", {
      mobtel: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      sentCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      errorCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0 
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Active'
      }
    }, {
      timestamps: true
    });

    return Simpak;
  };

  