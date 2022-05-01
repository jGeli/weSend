const serialportgsm = require('serialport-gsm');

const MessageModel = require('./app/services/message.model');
const { format_number } = require('./app/utils/formatter');
var GsmModem = serialportgsm.Modem()

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
  incomingCallIndication: true,
  incomingSMSIndication: true,
  pin: '',
  customInitCommand: 'AT^CURC=0',
  cnmiCommand:'AT+CNMI=2,1,0,2,1',

//   logger: console
}


let port;
let no = 0;


serialportgsm.list((err,result) => {
    port = result[no] && result[no].path ;
    if(port){
    GsmModem.open(port, options)
    }
});


function stopDev(){
        process.exit()
}


class GsmService{
    static async processSms(){
    try {

       let recipient = await MessageModel.getUnprocessRecipient();
       if(!recipient) {
        console.log('No Recipient!')
        return stopDev();
       }
       let { id, Mobtel, Message: { id: messageId, content, isFlash } } = recipient
       let res = await MessageModel.checkDuplicateSent(id, Mobtel, messageId);
       if(res){
        console.log(`Duplicate Entry ${id} -- ${res.id}`)
      return MessageModel.setRecipientSent(id, port)
        .then((a) => {
            // console.log(a)
            return stopDev();
        }).catch(err => {
            console.log(err)
            return stopDev();
        })
        }

       if(recipient && port && !res) {
        if(!format_number(Mobtel)) {
            await MessageModel.setRecipientSent(id, port)
           return GsmModem.close(() => process.exit());
        }


        GsmModem.deleteAllSimMessages(callback => {
            console.log('Messages Deleted!')
        })

            GsmModem.sendSMS(format_number(Mobtel), content, isFlash, (result) => {
                let timeout = setTimeout(() => {
                        GsmModem.getOwnNumber((mob) => {
                            
                            let data = mob ? mob.data : {number: 'Errror'}
                            console.log(`Errroooooorrr heeeeeeeeeerrreeeeeeeeeeeeee:  ----->>>>>>>>>    ${data.number}`)
                           process.exit(230) 
                        });
                }, 60000);

                if(result && result.status == 'success' && result.data.recipient){
                  MessageModel.setRecipientSent(id, port)
                   .then(() => {
                       console.log('Sennnt!')
                    clearTimeout(timeout)
                    stopDev();
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
}, 3000)



module.exports = GsmService;