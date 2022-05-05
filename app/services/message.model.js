const db = require("../models");
const smsDb = require('../configs/smsdb.config');
const FsServices = require('./fsServices');
const { recipients } = require("../models");
// const SmsProcess = require('./smsProcess');
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


class MessageModel{

    static async createMessage({content, isFlash, Mobtels, startAt}){
      
   return await Messages.create({
            content,
            isFlash,
            Mobtels,
            startAt
        },
         {
            include: [ { 
                model: Recipient,
                as: 'Mobtels'
            }],
            raw : true , // <----------- Magic is here
            nest : true 
        },
        
        ) 
        .then(m => {

            console.log(m)
            return m
            // SmsServices.sendSms(m);    
            // res.status(200).json(m);    
        })
        .catch(err => {
            console.log(err)
            return err
            // return res.status(400).json({ errors, message: { text: 'Sending Failed!', type: 'error'}});
        })
    }

    static async getMessage(){





        let message = await Messages.findOne({ where: { isCompleted: false }, 
            // limit: 1,
            include: [  { model: Recipient,  as: 'Mobtels', where: { isSent: false }, required: false}],
        });
        return message
    }

    static async getUnprocessMessage(com){






        let message = await Messages.findOne({ where: { 
            [Op.or]: [{ [Op.and]: [{ isCompleted: false }, {isProcessing: false }, {isDeleted: false}]}, { [Op.and]: [{isProcessing: true}, {description: com }, {isCompleted: false }, {isDeleted: false}] }] 
        }, 
        include: [  { model: Recipient,  as: 'Mobtels', where: { isSent: false }, limit: 50, required: false}],
        });
        return message
    }

    static async getUnprocessRecipient(){

        let msg = await Messages.findOne({ where: { [Op.and]: [{ isDeleted: false }, { isCompleted: false }, { isProcessing: false }] },
            include: [  { model: Recipient,  as: 'Mobtels', where: { isSent: false }, limit: 1, required: false,
            include: [  { model: Messages,  as: 'Message', required: false}],
        }],
        });

        if(!msg) return null;
        await Messages.update({ isProcessing: true}, { where: { id: msg.id } })

        let { Mobtels } = msg;
        if(Mobtels && Mobtels.length == 0) {
            await Messages.update({  isCompleted: true, isProcessing: false }, { where: { id: msg.id } })
            return null;
        }
        
        

        return Mobtels[0]
    }

    static async setMessageProcessing(id, com){
        let message = await Messages.update({isProcessing: true, description: com},  { where: { id: id }, 
        });
        console.log('Message updated!')
        return message
    }

    static async setMessagesUnprocessing(){
        let message = await Messages.update({isProcessing: false},  { where: {  }
        });
        console.log('Message updated!')
        return message
    }

    static async getIncompleteMessage(){
     let message = await Messages.findAll({
            where: { [Op.and]: [{
                isCompleted: false
            }, {
                isDeleted: false
            }]
            },
            // attributes: ['id', [sequelize.literal('(SELECT COUNT(*) FROM recipients WHERE recipients.isSent = false AND recipients.messageId = id)'), 'count']],
            include: [{
                model: Recipient,
                as: "Mobtels",
                required: false
                }],
        });

        return message
    }

    static async setMessageUnprocessing(id){
        let message = await Messages.update({isProcessing: false},  { where: { id: id }, 
        });
        console.log('Message updated!')
        return message
    }

    static async setMessageComplete(id){
        let message = await Messages.update({isCompleted: true},  { where: { id: id }});
        console.log('Message updated!')
        return message
    }

    static async checkDuplicateSent(id, Mobtel, messageId){

        let message = await Recipient.findOne({ where: {[Op.and]: [{Mobtel: Mobtel}, {messageId: messageId}, {isDeleted: false},{isSent: true}, { id: { [Op.ne]: id  }}]}}); 
        return message;

    }

    static async setRecipientSent(id, port){
        // let rcpt = await 
        try {
      
        let rcpt = await Recipient.findByPk(id);
        if(!rcpt) return console.log('Cant Find Recipient')
        let Msg = await Messages.findByPk(rcpt.messageId);
        let totalSent = Msg.totalSent + 1;
        await Recipient.update({isSent: true, path: port},  { where: { id: id }});
        await Messages.update({ totalSent: totalSent, isProcessing: false }, {where: { id: rcpt.messageId }});
        return true
    }catch(err){
        console.log(err)
        return false
    }
 
    }

    static async getRecipient(){
        let message = await Messages.findOne({ where: { isCompleted: false }, 
            // limit: 1,
            include: [  { model: Recipient,  as: 'Mobtels', required: false}],
        });
        return message
    }

    static getMobtels(val, cb){
        console.log(val)
        let sqlQuery = `SELECT Mobtel, Serial
        FROM smsalldbdev.mobtels ORDER BY id limit ${val}, 10000;`

       return smsDb.query(sqlQuery, function (error, results, fields) {
            // console.log(results)
            if (error) return console.log(error);
            cb(results)
          })
    }

    static async setBusyDevice(val){
        if(!val) return console.log('No Devices to be added!')
            await Devices.update({isBusy: true},{where: { path: val  }}) 
            // console.log(dv)
        return val;
    }

    static async setNotBusyDevice(val){
        if(!val) return console.log('No Devices to be added!')
            Devices.update({isBusy: false},{where: { path: val  }}) 
        return val;
    }

    static async setActiveDevice(val){
        if(!val) return console.log('No Devices to be added!')
            Devices.update({isActive: false},{where: { path: val  }}) 
            console.log(dv)
        return val;
    }

    static async setNotActiveDevice(val){
        if(!val) return console.log('No Devices to be added!')
            Devices.update({isActive: false},{where: { path: val  }}) 
            // console.log(dv)
        return val;
    }

    static async updateDevice({ id, isBusy, isActive }){
        if(!id) return console.log('No Device to update!')
            Devices.update({isActive, isBusy},{where: { id: id  }})
            .then(doc => {
                return doc;
            })
            .catch(err => {
                console.log(err)
                return;
            });
    }

    static async initDevices(val){
        if(!val) return console.log('No Devices to be added!')

        for(let ind = 0; ind < val.length; ind++){
            if(!val[ind]) return console.log('Device Not Defined!')
            let dv = await Devices.findOne({where: { path: val[ind].path }});
            if(!dv) {
                 Devices.create(val[ind])
                .then(doc => {
                    return doc
                })
                .catch(err => {
                    console.log(err)
                    return err
                })
            } else {
            Devices.update({isActive: false, isBusy: false},{where: { path: val[ind].path  }})
            .then(doc => {
                return doc;
            })
            .catch(err => {
                console.log(err)
                return;
            })
        }
        } 
    return val;
    }

    static async getDevices(){
            let devices = await Devices.findAll();
        return devices;
    }

    static async stopPorts(){
        let devices = await Devices.destroy({where: {}});
    return devices;
    }

        static async stopPorts(){
            let devices = await Devices.destroy({where: {}});
        return devices;
        }

}

module.exports = MessageModel;