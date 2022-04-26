const serialportgsm = require('serialport-gsm');
// const dvConfig = require('../config/device.config');

const CronSend = require('./cronsend');
const FsServices = require('./fsServices');

// let GsmModem = new serialportgsm.Modem()
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

  logger: console
}


let phone = {
  name: "My-Name",
  number: "9774461641",
  numberSelf: "+49XXXXXX",
  mode: "PDU"
}

// Port is opened

// });

// serialportgsm.list((err, result) => {
//    result[0] && GsmModem.open(result.find(a => a.serialNumber == dvConfig.device2).path, options);
//   //  result[0] && Device1.open(result.find(a => a.serialNumber == dvConfig.device2), options); 

//     });


// GsmModem.open('COM5', options);

// setTimeout(() => {
//   GsmModem.close(() => process.exit);
// }, 90000);

module.exports = (GsmModem) => {
  GsmModem.on('open', (data) => {
    console.log(`Modem Sucessfully Opened`);
    
    console.log(`Event Open: ` + JSON.stringify(data));
  
    // now we initialize the GSM Modem
    GsmModem.initializeModem((msg, err) => {
      if (err) {
        console.log(`Error Initializing Modem - ${err}`);
      } else {
        // console.log(`InitModemResponse: ${JSON.stringify(msg)}`);
  
        // console.log(`Configuring Modem for Mode: ${phone.mode}`);
        // set mode to PDU mode to handle SMS
        GsmModem.setModemMode((msg,err) => {
          if (err) {
            console.log(`Error Setting Modem Mode - ${err}`);
          } else {
            console.log(`Set Mode: ${JSON.stringify(msg)}`);
  
  
            // execute a custom command - one line response normally is handled automatically
            GsmModem.executeCommand('AT^GETPORTMODE', (result, err) => {
              if (err) {
                console.log(`Error - ${err}`);
              } else {
                // console.log(`Result ${JSON.stringify(result)}`);
              }
            });
  
            // execute a complex custom command - multi line responses needs own parsing logic
            const commandParser = GsmModem.executeCommand('AT^SETPORT=?', (result, err) => {
              if (err) {
                console.log(`Error - ${err}`);
              } else {
                // console.log(`Result ${JSON.stringify(result)}`);
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
  
    // //     // get info about stored Messages on SIM card
    // //     GsmModem.checkSimMemory((result, err) => {
    // //       if(err) {
    // //         console.log(`Failed to get SimMemory ${err}`);
    // //       } else {
    // //         console.log(`Sim Memory Result: ${JSON.stringify(result)}`);
  
          
  
    // //         // read the whole SIM card inbox
    // //       //   GsmModem.getSimInbox((result, err) => {
    // //       //     if(err) {
    // //       //       console.log(`Failed to get SimInbox ${err}`);
    // //       //     } else {
    // //       //       console.log(`Sim Inbox Result: ${JSON.stringify(result)}`);
    // //       //     }
  
    // //       //     // Finally send an SMS
              
  
    // //       //   });
  
    // //       }
    // //     });
  
        }
    });
   
    GsmModem.on('close', data => {
      //whole message data
      // console.log(data.modem);
      console.log(`Event Close: ` + JSON.stringify(data));
      FsServices.removeDevice(data.modem);
    });
  
    GsmModem.on('error', data => {
      //whole message data
        console.log('Error')
      console.log(`Event Error: ` + JSON.stringify(data));
    });
  });



  return GsmModem
}