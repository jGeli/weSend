// const socketIo = require("socket.io");
let MessageController = require('../controllers/message.controller');
let SmsProcess = require('../services/smsProcess');
let CronSend = require('../services/cronsend');
let FsServices = require('../services/fsServices');
let MessageModel = require('../services/message.model');
const { device } = require('../models');

let devices = [];
let portDev = [];

// CronSend.initPorts();



setInterval(() => {
 devs = CronSend.getActiveDevices();
 devices = devs.devices;
 portDev = devs.portDev;
}, 5000)




module.exports = (io) => {
    io.on("connection", (socket) => {
        // sockets = socket
       
        socket.on("connect", () => {
          console.log('client Conntected')
        })
        socket.on("processSms", (val) => {
            CronSend.processSms();
            console.log('Processing')          
        })

        socket.on("initDevice", (val) => {
          console.log('Initializing');
          console.log(devices)
            // console.log(val)
            // console.log(devices)
            // console.log(portDev)  
          // console.log(gsm);
        //  MessageController.processMessage();

          // SmsProcess.initDevices(val);
          // PortServices.initDevices(val);
         })

         socket.on("stopDevice", (val) => {
          console.log('Initializing');
            console.log(val)
            // CronSend.stopDevice(val)

        //  MessageController.processMessage();

          // SmsProcess.initDevices(val);
          // PortServices.initDevices(val);
         })

         socket.on("getMobtels", (val) => {
            console.log('Get mobtels')
             MessageModel.getMobtels(val, data => {
              //  console.log(data)
              console.log('Set socket')
                  socket.emit('setMobtels', data)
            });
          
          // console.log('Initializing');
            // console.log(val)
            // CronSend.stopDevice(val)
            
        //  MessageController.processMessage();

          // SmsProcess.initDevices(val);
          // PortServices.initDevices(val);
         })

         socket.on("sendSms", async (data) => {
          console.log('Sending Dev SMS')
          let res = await  MessageController.createMessage(data);
            
      //     let ind = portDev.indexOf(path);
      //    devices[ind].createBulkSms({
      //      content, isFlash, startAt
      //    });
       });

         socket.on("sendDevSms", ({content, isFlash, isPriority, startAt, path}) => {
           console.log('Sending Dev SMS')
           let ind = portDev.indexOf(path);
           console.log(ind)
          //  console.log(act[path])
          devices[ind].createBulkSms({
            content, isFlash, startAt
          });
        })

         socket.on("getMessage", async (data) => {
           console.log('get message')
             // console.log('bb', data)
        // let ports = SmsProcess.getPorts();
          //  let gsmPorts = PortServices.getGsmPorts();
          // console.log(ports)
          //  console.log('Hello World!')
          //  socket.emit('setPorts', ports)
           // console.log(data)
          let message = await MessageController.getMessage();
                socket.emit('setMessage', message)
         })

          socket.on("getPorts", async (data) => {
            let devices = await CronSend.getDevices();
            // console.log(devices)
              // console.log('bb', data)
              console.log('Get Devices!')
              console.log(devices)
                         socket.emit('setDevices', devices)

              // socket.emit('setDevices', devices);
              //  let gsmPorts = PortServices.getGsmPorts();
    
                // console.log('Hello World!')
              //  socket.emit('sendPorts', gsmPorts)
          // console.log(data)
                // socket.emit('getDevices', devices)
        })

        socket.on("disconnect", () => {
          console.log("Client disconnected");
        });
      });
      // return io
};
