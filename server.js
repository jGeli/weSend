require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path')
const port = process.env.PORT || 23005;
const app = express();


var corsOptions = {
  origin: "*"
};

app.use(express.static(path.join(__dirname, 'build')));


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json({limit: '50mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false, limit: '50mb' }));



const db = require("./app/models");
db.sequelize.sync(
    ).then(() => { 
    // initial();
  });


require('./app/routes/sms.routes')(app);

const server = http.createServer(app);

// const PortServices = require('./app/services/portServices');
// const io = socketIo(server);

server.listen(port, () => console.log(`Listening on port ${port}`));

// const CronSend = require('./app/services/cronsend');
const io = socketIo(server, {
path: '/api/socket',
cors: "*"
});
// let cron1 = new CronSend({
//   interval: '.1'
// });

// cron1.start();


io.on("connection", (socket) => {
  console.log('conntected')
  socket.on("connect", () => {
    console.log('client Conntected')
  })

  socket.on("initDevice", (val) => {
    console.log('Initializing')
    // PortServices.initDevices(val);
   })
 
   socket.on("sendSms", (val) => {
     console.log(val)
     // console.log(data)
    //  handleSend(val);
     // console.log('client Conntected')
   })
 
   socket.on("getPorts", (data) => {
       // console.log('bb', data)
 
    //  let gsmPorts = PortServices.getGsmPorts();
 
     console.log('Hello World!')
    //  socket.emit('sendPorts', gsmPorts)
     // console.log(data)
   })
 

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

});

// io.on('init', val => {
//   console.log(val)
// });

// socket.on('init', () => {
//   console.log('wawa')
// })

