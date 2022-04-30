const serialportgsm = require('serialport-gsm');
const MessageModel = require('../app/services/message.model');
const { format_number } = require('../app/utils/formatter');
let options = {
    baudRate: 19200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    xon: false,
    rtscts: false,
    rtscts: false,
    xoff: false,
    xany: false,
    autoDeleteOnReceive: true,
    enableConcatenation: true,
    incomingCallIndication: false,
    incomingSMSIndication: false,
    pin: '',
    customInitCommand: 'AT^CURC=0',
    cnmiCommand:'AT+CNMI=2,1,0,2,1',
  
    logger: console
  }

let port;
let no = 4;
const GsmModem = serialportgsm.Modem();


serialportgsm.list((err,result) => {
        port = result[no].path;
        if(port){
            GsmModem.open(result[no].path, options)
        }
});

function stopDev(){
    // console.log('stop')
    // console.log(GsmModem.close())
   GsmModem.close();
}

// function initDev(){
//     serialportgsm.list( async (err,result) => {
//         console.log(result)
//         GsmModem.open(result[0].path, options)
// });

//     setTimeout(() => {
//         startDev()
//     }, 5000)
// }

// function startDev(){
//         // sendDevSms()
//     // GsmModem.sendSMS('639774461641', `Hello World`, false, async (result) => {
//     //     if(result && result.status == 'success' && result.data.recipient){
//     //             console.log('Sent naaa!')
//     //      }
//     //  });
// }


class GsmService{
    //Get Port
    // let GsmModem = new serialportgsm.Modem();

    //  let Gsm = new GsmModem;
    static getDevice(val){

    }

    static async processSms(){
                  //Get Message
       let recipient = await MessageModel.getUnprocessRecipient();
       console.log('Recipientsss!')
       console.log(recipient)
       if(recipient) {

            console.log(recipient)
           let { id, Mobtel, Message: { content, isFlash } } = recipient
            console.log(Mobtel)
            console.log(content)
            console.log(isFlash)
            console.log(id)
            GsmModem.sendSMS(format_number(Mobtel), content, isFlash, async (result) => {
                if(result && result.status == 'success' && result.data.recipient){
                   await MessageModel.setRecipientSent(id, port)
                    GsmModem.close(() => process.exit);
                    console.log('sending')
                 }
             });
            } else {
                console.log('No Recipient!')
                stopDev();
            }
    }


    static sendDevSms(){
        // try{
            console.log('wawaw')
           
                // setTimeout(() => {
                    GsmModem.sendSMS('639774461641', `Hello World`, false, async (result) => {
                        if(result && result.status == 'success' && result.data.recipient){
                                console.log('sending')
                                stopDev();

                                // GsmModem.close(() => process.exit);
                           
                            }
                     });
                //  }, 5000);

        // }catch(err){
        //     console.log(err)
        // }
            
}

}

setTimeout(() => {
GsmService.processSms();
}, 3000);





// module.exports = GsmService