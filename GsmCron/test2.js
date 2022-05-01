const { spawn } = require("child_process");
const db = require('../app/models');
const dbs = require('../app/configs/smsdb.config');
const MessageModel = require("../app/services/message.model");
const serialportgsm = require('serialport-gsm');


let port;
let no = 2;


serialportgsm.list((err,result) => {
        port = result[no] && result[no].path ;
});


function crun(){

    const ls = spawn("node", ["gsmCron2.js"]);
    ls.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
        });
        
        ls.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        // crun();
        });
        
        ls.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
        crun();
        });
    }
    
function init(){
    return dbs.getConnection(function(err, connection) {

          if(err) return console.log('DB Error!');
          console.log('Db Connected')
          crun();
          setInterval( async () => {
        if(port){
          let messages = await MessageModel.getIncompleteMessage();
          messages.forEach((a) => {
              let { id, Mobtels } = a;
              let ind = Mobtels.find(ab => !ab.isSent);
              if(!ind){
                  MessageModel.setMessageComplete(id);
              }
          })
          } else {
              console.log('No Port Available')
          }
      }, 30000)
      });
    }
    
    init();
    

// MessageModel.resetMessages()




// device1.checkDeviceStatus();

// SmsProcess.start();
// console.log(obj.length);
// console.log(objs.length);