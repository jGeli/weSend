const db = require("../models");
const Event_Sockets = db.event_socket;


const Op = db.Sequelize.Op;
// smsDb.getConnection(function(err, connection) {
//     console.log(err)
//       if(err) return console.log('DB Error!');
//       console.log('Db Connected')
//     // console.log(connection)
//   });


class EventSocketModel{

    static async createEvent({type, content, description, status}){
        return await Event_Sockets.create({
            description: description, 
            type: type, 
            content: content, 
            status: status,
        })   
    }

    static async getEvents({limit=100, offset=0 }){
        return await Event_Sockets.findAll({
            limit: limit , 
            offset: offset, 
            order: [["id","DESC"]]
        })   
    }
}

module.exports = EventSocketModel;