const { spawn } = require("child_process");
const db = require('./app/models');
const dbs = require('./app/configs/smsdb.config');
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

        return setTimeout(() => {
          console.log('Trigger Error Restart!')
          crun();
        }, 60000)
      } else {
        crun();
      }
    });
}

function init(){
<<<<<<< HEAD

return dbs.getConnection(function(err, connection) {
=======
return dbs.getConnection(function(err, connection) {
  console.log(err)
>>>>>>> 55385aaafba9d434ad78cd9dafa9679755a95f2d
      if(err) return console.log('DB Error!');
      console.log('Db Connected')
      crun();
  });
}

init();