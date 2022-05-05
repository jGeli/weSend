const dbs = require('./app/configs/smsdb.config');
const serialportgsm = require('serialport-gsm');
const MessageModel = require('./app/services/message.model');
const DeviceModel = require('./app/model/device.model');
const SimpakModel = require('./app/model/simpak.model');

var gsmModem = serialportgsm.Modem()
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
  // cnmiCommand:'AT+CNMI=2,1,0,2,1',

  // logger: console
}


let phone = {
  name: "My-Name",
  number: "+639774461641",
  numberSelf: "+49XXXXXX",
  mode: "PDU"
}

// Port is opened
gsmModem.on('open', (result) => {
  let { modem } = result.data;
  // now we initialize the GSM Modem
  gsmModem.initializeModem((msg, err) => {
    if (err) {
      console.log(`Error Initializing Modem - ${err}`);
    } else {

      // set mode to PDU mode to handle SMS
      gsmModem.setModemMode((msg,err) => {
        if (err) {
          console.log(`Error Setting Modem Mode - ${err}`);
        } else {

          // get the Network signal strength
          gsmModem.getNetworkSignal((result, err) => {
            if (err) {
              console.log(`Error retrieving Signal Strength - ${err}`);
            } 
          });

          // get Modem Serial Number
          gsmModem.getModemSerial((result, err) => {
            if (err) {
              console.log(`Error retrieving ModemSerial - ${err}`);
            }
          });

          // execute a custom command - one line response normally is handled automatically
          gsmModem.executeCommand('AT^GETPORTMODE', (result, err) => {
            if (err) {
              console.log(`Error - ${err}`);
            } 
          });

          // execute a complex custom command - multi line responses needs own parsing logic
          const commandParser = gsmModem.executeCommand('AT^SETPORT=?', (result, err) => {
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
      }, phone.mode);


      gsmModem.getModemSerial((result, err) => {
        let { data } = result;
             gsmModem.getOwnNumber((mob) => {
               let { number } = mob.data;
                 DeviceModel.initDevice({serial: data.modemSerial, path: modem, mobtel: number })
             });
        if (err) {
          console.log(`Error retrieving ModemSerial - ${err}`);
        }
      });

      let num = 
      gsmModem.getOwnNumber((mob) => {
        let data = mob ? mob.data : {number: 'Errror'}
        if(mob){
          num = data.number
        }

    });


      // get info about stored Messages on SIM card
      gsmModem.checkSimMemory((result, err) => {
        if(err) {
          console.log(`Failed to get SimMemory ${err}`);
        } else {
          console.log(`Sim Memory Result: ${JSON.stringify(result)}`);

            let timeout = setTimeout(() => {
                // console.log(num)
                console.log(`Errroooooorrr heeeeeeeeeerrreeeeeeeeeeeeee:  ----->>>>>>>>>    ${num}`)
                SimpakModel.addErrorSent(num)
                .then(a => {
                  process.exit(230) 
                })
                .catch(err => {
                  process.exit(230)
                })
      }, 10000);


            const message = `Hello ${phone.name}, Try again....This message was sent`;
            gsmModem.sendSMS(phone.number, message, true, (result) => {
              if(result && result.status == 'success' && result.data.recipient){
                console.log('Sennnt!')
                gsmModem.getOwnNumber((mob) => {
                  let data = mob ? mob.data : {number: 'Errror'}

                  SimpakModel.addSuccessSent(data.number)
                  .then(() => {
                   clearTimeout(timeout)
                  return
                  })
                  .catch(err => {
                      console.log(err)
                      console.log(err)
                      // return stopDev()
                  })
                
              });
              
               }
            });
        }
      });
    }
  });


  gsmModem.on('onNewMessageIndicator', data => {
    //indicator for new message only (sender, timeSent)
    console.log(`Event New Message Indication: ` + JSON.stringify(data));
  });

  gsmModem.on('onNewMessage', data => {
    //whole message data
    console.log(`Event New Message: ` + JSON.stringify(data));
  });

  gsmModem.on('onSendingMessage', data => {
    //whole message data
    console.log(`Event Sending Message: ` + JSON.stringify(data));
  });

  gsmModem.on('onNewIncomingCall', data => {
    //whole message data
    console.log(`Event Incoming Call: ` + JSON.stringify(data));
  });

  gsmModem.on('onMemoryFull', data => {
    //whole message data
    console.log(`Event Memory Full: ` + JSON.stringify(data));
  });

  gsmModem.on('close', data => {
    //whole message data
    console.log(data)
    if(data){
      DeviceModel.stopDevice(data.modem)
    }
    // gsmModem.getModemSerial((result, err) => {
    //   let { data } = result;
    //   
    //   console.log(`Event Close: ` + JSON.stringify(data));
    // });
  });

});

let port;
let no = 0;










serialportgsm.list((err, result) => {
        // console.log(result[no].path)
        const res = result[no] && result[no].path;
        port = res
    if(res){
      dbs.getConnection(function(err, connection) {
        if(err) return console.log('DB Error!');
        console.log('Db Connected')
        // crun();
       gsmModem.open(res, options)

    });
    }
});


// setTimeout(() => {
//   gsmModem.close(() => process.exit);
// }, 90000);
