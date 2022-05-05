const db = require("../models");
const smsDb = require('../configs/smsdb.config');
const Messages = db.messages;
const Devices = db.device;
const Recipient = db.recipients;


const Op = db.Sequelize.Op;
const sequelize = db.Sequelize;
// smsDb.getConnection(function(err, connection) {
//     console.log(err)
//       if(err) return console.log('DB Error!');
//       console.log('Db Connected')
//     // console.log(connection)
//   });


class EventSocketModel{

    static async createEvent({content, isFlash, Mobtels, startAt}){
            
    }
}

module.exports = EventSocketModel;