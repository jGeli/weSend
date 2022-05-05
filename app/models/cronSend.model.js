const path = require('path');
const db = require("../models");
const smsDb = require('../configs/smsdb.config');
const FsServices = require('./fsServices');
const MessageModel = require('../services/message.model');
const Messages = db.messages;
// const Mobtel = db.mobtels;
const Recipient = db.recipients;


class CronSend{

    static async createMessage({content, isFlash, isPriority, Mobtels, startAt}){
      
        Messages.create({
            content,
            isFlash,
            isPriority,
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

            // SmsServices.sendSms(m);    
            // res.status(200).json(m);    
        })
        .catch(err => {
            console.log(err)
            // return res.status(400).json({ errors, message: { text: 'Sending Failed!', type: 'error'}});
        })
    }

    static async markSent(){


    }

    static async addRecipient(){ 



    }

}

module.exports = CronSend;