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
let no = 3;
const GsmModem = serialportgsm.Modem();


serialportgsm.list((err,result) => {
    port = result[no] && result[no].path ;
    if(port){
    GsmModem.open(port, options)
    }
});

function stopDev(){
if(port){
    process.exit()
} else {
   return process.exit();
}
}


class GsmService{
static async processSms(){
try {

   let recipient = await MessageModel.getUnprocessRecipient();
   if(!recipient) {
    console.log('No Recipient!')
    return stopDev();
   }
   let { id, Mobtel, Message: { content, isFlash } } = recipient

   if(recipient && port) {
    if(!format_number(Mobtel)) {
        await MessageModel.setRecipientSent(id, port)
       return GsmModem.close(() => process.exit);
    }

        GsmModem.sendSMS(format_number(Mobtel), content, isFlash, (result) => {
            let timeout = setTimeout(() => {
                       process.exit(230) 
            }, 90000);

            if(result && result.status == 'success' && result.data.recipient){
              MessageModel.setRecipientSent(id, port)
               .then(() => {
                   console.log('Sennnt!')
                stopDev();
                clearTimeout(timeout)
            //    return
               })
               .catch(err => {
                   console.log(err)
                   console.log(err)
                   return stopDev()
               })
             }
         });
        } else {
            console.log('No Recipient!')
            stopDev();
        }
} catch(err){
    console.log(err)
}
}
}

setTimeout(() => {
GsmService.processSms();
}, 5000);