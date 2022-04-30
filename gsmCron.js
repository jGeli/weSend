const serialportgsm = require('serialport-gsm');
const MessageModel = require('./app/services/message.model');
const { format_number } = require('./app/utils/formatter');
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
let no = 0;
const GsmModem = serialportgsm.Modem();


serialportgsm.list((err,result) => {
        
        port = result[no] && result[no].path ;
        if(port){
            console.log('Oppen')
        GsmModem.open(port, options)
        }
});

function stopDev(){
    // console.log('stop')
    // console.log(GsmModem.close())
    if(port){
        GsmModem.close();
    } else {
        process.exit
    }
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


    static async processSms(){
                  //Get Message
        if(!port) {
            stopDev()
            return console.log('No Device!')
        }


       let recipient = await MessageModel.getUnprocessRecipient();
       let { id, Mobtel, Message: { content, isFlash } } = recipient
       console.log()
       console.log(!format_number(Mobtel))
       console.log(port)
       console.log(recipient && port)
   
       if(recipient && port) {
        if(!format_number(Mobtel)) {
            await MessageModel.setRecipientSent(id, port)
           return GsmModem.close(() => process.exit);
        }

           console.log('gagagaga')
        console.log(content)
        console.log(!format_number(Mobtel))
            GsmModem.sendSMS(format_number(Mobtel), content, isFlash, (result) => {
                console.log(`Output --> ${JSON.stringify(result)}`)
                if(result && result.status == 'success' && result.data.recipient){
                    console.log('sent Naa!')
                //   MessageModel.setRecipientSent(id, port)
                //    .then(() => {
                //     stopDev();
                //    })
                //    .catch(err => {
                //        console.log(err)
                //    })
                    // GsmModem.close(() => process.exit);
                    // console.log('sending')
                    stopDev();
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
}, 5000);





// module.exports = GsmService