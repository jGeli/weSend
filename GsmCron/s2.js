const { spawn } = require("child_process");
const db = require('../app/models');
const dbs = require('../app/configs/smsdb.config');


function crun(){
    const ls = spawn("node", ["d2.js"]);
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
          }, 120000)
        } else {
          crun();
        }
      });
  }
  
  function init(){
  
    return dbs.getConnection(function(err, connection) {
      if(err) return console.log('DB Error!');
      console.log('Db 2 Connected')
      db.sequelize.sync(
        // {force: true}
        ).then(() => { 
          console.log('Db 1 Connected')
      crun();
      });
  });
  }
  
  init();