const db = require("../models");
const Simpak = db.simpak;


const Op = db.Sequelize.Op;
const sequelize = db.Sequelize;
// smsDb.getConnection(function(err, connection) {
//     console.log(err)
//       if(err) return console.log('DB Error!');
//       console.log('Db Connected')
//     // console.log(connection)
//   });


class SimpakModel{

    static async addSuccessSent(mobtel){
        let sim = await Simpak.findOne({where: { mobtel: mobtel }});
        let total = sim.sentCount + 1;
                sim.sentCount = total;
                sim.status = 'Active';
               await sim.save(); 
        return sim;
    }

    static async addErrorSent(mobtel){
        let sim = await Simpak.findOne({where: { mobtel: mobtel }});
        let total = sim.errorCount + 1;
                sim.errorCount = total;
                sim.status = 'Error';
               await sim.save(); 
        return sim;
    }
}

module.exports = SimpakModel;