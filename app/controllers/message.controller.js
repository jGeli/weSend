let MessageModel = require('../services/message.model');
let SmsProcess = require('../services/smsProcess');
let FsServices = require('../services/fsServices');


let { format_number } = require('../utils/formatter');

class MessageController{
    static createMessage({content, isFlash, startAt}){
        MessageModel.getMobtels(startAt, cb => {
            console.log(cb)
            MessageModel.createMessage({content, isFlash, startAt, Mobtels: cb })
        });
    }

    static async getMessage(){
     let message = await MessageModel.getMessage();
     return message;
    }

    static async processMessage(){

        //Find Device
        



        let devices = await MessageModel.getDevices();

        let device = devices.find(a => !a.isBusy);
      

        if(!device) return console.log('No Vacant Device')

        let dv =  await SmsProcess.initDevices(device.path);

        if(!dv) return console.log('No Device Found!')
      
        let arr = [];
                 devices.map(a => {
            if(device.serial != a.serial){
               return arr.push(a)
            } else {
               return arr.push({
                    ...a, isBusy: true
                });
            }
         });

        FsServices.writeJsonFile('devices.json', arr);
        let message = await this.getMessage();
        if(!message) return console.log('No Pending Message');
        FsServices.writeJsonFile(`${message.id}.json`, message);
         let x = 0;
         let { Mobtels } = message;


         const nextSend = (arr) => {

            if(x >= arr.length) return console.log('Finish Til End!');
              let mob = arr[x].Mobtel;  
              dv.sendSMS(admins[x], msg, false, async (result) => {
                if(result.data.recipient){
                    console.log(`${result.data.recipient} Error Tooool!`)
                //    let rs = await this.setSent(arr && arr.id ? arr.id : arr[x].id);
                    //    if(rs){
                        //    x++
                        //    this.setAddReach(userId)
                        //    nextSend(Mobtels.length ? Mobtels : [Mobtels]);
                //    }
               }
             });





         }



        













         nextSend(Mobtels);




        // SmsProcess.sendSms(message)
        console.log(message)
        // console.log(dv)
        return message
    }

}


module.exports = MessageController;