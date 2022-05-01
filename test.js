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
    // crun();
    });
    
    ls.on("close", (code) => {

      console.log(`child process exited with code ${code}`);
      if(code == 230){
        console.log("Tunaay  na errror")
        return process.exit()
      }

        crun();
    });
}

function init(){
return dbs.getConnection(function(err, connection) {

      if(err) return console.log('DB Error!');
      console.log('Db Connected')
      crun();
  });




}

init();

// MessageModel.resetMessages()
