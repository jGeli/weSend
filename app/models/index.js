const dbConfig = require("../configs/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.Port,
  dialect: dbConfig.dialect,
  // operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  define: {
    timestamps: false
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Barangay Models
db.device = require("./device.model.js")(sequelize, Sequelize);
db.event_socket = require('./event_socket.model.js')(sequelize, Sequelize);
db.simpak = require('./simpak.model.js')(sequelize, Sequelize);

db.messages = require("./message.model.js")(sequelize, Sequelize);
db.recipients = require("./recipient.model.js")(sequelize, Sequelize);
db.mobtels = require('./mobtel.model.js')(sequelize, Sequelize);


db.device.belongsTo(db.simpak, {  constraints: false})
db.simpak.belongsTo(db.device, {  constraints: false})


db.messages.hasMany(db.recipients, { as: 'Mobtels', foreignKey: 'messageId',
constraints: false
});

db.recipients.belongsTo(db.messages, { as: 'Message', foreignKey: 'messageId', sourceKey: 'messageId',
constraints: false
});



module.exports = db;