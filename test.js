const { spawn } = require("child_process");
const db = require('./app/models');
const dbs = require('./app/configs/smsdb.config');
const MessageModel = require("./app/services/message.model");
const serialportgsm = require('serialport-gsm');


let port;
let no = 0;



serialportgsm.list((err,result) => {
        port = result[no] && result[no].path ;
});




function crun(){

    const ls = spawn("node", ["gsmCron.js"]);

    
    ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    });
    
    ls.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    crun();
    });
    
    ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    crun();
    // setTimeout(() => {
    //     console.log('Repeating!!')
    //     crun()
    // }, 1000)
    });
}


function init(){


dbs.getConnection(function(err, connection) {
    // console.log('connecting')
    // console.log(err)

      if(err) return console.log('DB Error!');
      console.log('Db Connected')
      crun();
      setInterval( async () => {
        console.log('Get Messages')
        if(port){
  
      let messages = await MessageModel.getIncompleteMessage();
      messages.forEach((a) => {
          let { id, Mobtels } = a;
          let ind = Mobtels.find(ab => !ab.isSent);
          if(!ind){
              console.log('Heellloow!')
              MessageModel.setMessageComplete(id);
          }
      })
      } else {
          console.log('No Port Available')
      }
  
  }, 30000)

    //   db.sequelize.sync(
    //     ).then(() => { 
        // initial();
        // return 
    
    // })
    // .catch(err => {
    //     console.log(err)
    // });
    // console.log(connection)
  });




}

init();

// MessageModel.resetMessages()




// device1.checkDeviceStatus();

// SmsProcess.start();
// console.log(obj.length);
// console.log(objs.length);