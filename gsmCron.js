const serialportgsm = require('serialport-gsm');
const DeviceModel = require('./app/model/device.model');
const SimpakModel = require('./app/model/simpak.model');

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

  // logger: console
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
        process.exit();
}


class GsmService{
    static async processSms(){
    try {

       let recipient = await MessageModel.getUnprocessRecipient();
       if(!recipient) {
        console.log('No Recipient!')
        return setTimeout(() => {
          stopDev();
        }, 60000)
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


        // GsmModem.deleteAllSimMessages(callback => {
        //     console.log('Messages Deleted!')
        // })

            GsmModem.sendSMS(format_number(Mobtel), content, isFlash, (result) => {
                console.log('Sending!')
                GsmModem.getOwnNumber((mob) => {
                  let data = mob ? mob.data : {number: 'Errror'}
                  
                let timeout = setTimeout(() => {
                            SimpakModel.addErrorSent(data.number);
                            console.log(`Errroooooorrr heeeeeeeeeerrreeeeeeeeeeeeee:  ----->>>>>>>>>    ${data.number}`)
                           process.exit(230) 
                }, 60000);
                console.log(result)
                if(result && result.status == 'success' && result.data.recipient){
                  console.log('Sennnt!')
                  SimpakModel.addSuccessSent(data.number)
                  MessageModel.setRecipientSent(id, port)
                   .then(() => {
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
             });
            } else {
                console.log('No Recipient!')
                return setTimeout(() => {
                  stopDev();
                }, 60000)
                // stopDev();
            }
    } catch(err){
        console.log(err)
    }
    }
}



GsmModem.on('open', (result) => {
  let { modem } = result.data;

  // now we initialize the GSM Modem
  GsmModem.initializeModem((msg, err) => {
    console.log(msg)
    if (err) {
      console.log(`Error Initializing Modem - ${err}`);
    } else {

      // set mode to PDU mode to handle SMS
      GsmModem.setModemMode((msg,err) => {
        if (err) {
          console.log(`Error Setting Modem Mode - ${err}`);
        } else {


          // execute a custom command - one line response normally is handled automatically
          GsmModem.executeCommand('AT^GETPORTMODE', (result, err) => {
            if (err) {
              console.log(`Error - ${err}`);
            } 
          });

          // execute a complex custom command - multi line responses needs own parsing logic
          const commandParser = GsmModem.executeCommand('AT^SETPORT=?', (result, err) => {
            if (err) {
              console.log(`Error - ${err}`);
            }
          });
          const portList = {};
          commandParser.logic = (dataLine) => {
            if (dataLine.startsWith('^SETPORT:')) {
              const arr = dataLine.split(':');
              portList[arr[1]] = arr[2].trim();
            }
            else if (dataLine.includes('OK')) {
              return {
                resultData: {
                  status: 'success',
                  request: 'executeCommand',
                  data: { 'result': portList }
                },
                returnResult: true
              }
            }
            else if (dataLine.includes('ERROR') || dataLine.includes('COMMAND NOT SUPPORT')) {
              return {
                resultData: {
                  status: 'ERROR',
                  request: 'executeCommand',
                  data: `Execute Command returned Error: ${dataLine}`
                },
                returnResult: true
              }
            }
          };
        }
      }, "PDU");




      GsmModem.getModemSerial((result, err) => {
        let { data } = result;
             GsmModem.getOwnNumber((mob) => {
               let { number } = mob.data;
                 DeviceModel.initDevice({serial: data.modemSerial, path: modem, mobtel: number })
             });
        if (err) {
          console.log(`Error retrieving ModemSerial - ${err}`);
        }
      });

        
      // get info about stored Messages on SIM card
      GsmModem.checkSimMemory((result, err) => {
        if(err) {
          console.log(`Failed to get SimMemory ${err}`);
        } else {
          GsmModem.getSimInbox((result, err) => {
            if(err) {
              console.log(`Failed to get SimInbox ${err}`);
            } else {
              console.log(`Sim Inbox Result: ${JSON.stringify(result)}`);
            }

            // Finally send an SMS
            GsmService.processSms();
          });

        }
      });

    }
  });

  
  GsmModem.on('onMemoryFull', data => {
    //whole message data



  });

  GsmModem.on('close', data => {
    //whole message data
    if(data){
      DeviceModel.stopDevice(data.modem)
    }
    console.log(`Event Close: ` + JSON.stringify(data));
  });
});





// module.exports = GsmService;