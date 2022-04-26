require('dotenv').config();
const serialPort = require('serialport-gsm');
const mysql = require('mysql');
const path = require('path');
const db = require("../models");
const dumData = require('../../processes/sample.json');


const devices = [];
const portDev = [];
let gsmPorts = [];

// const GsmModem = require('./gsmServices');
const FsServices = require('./fsServices');
const MessageModel = require('./message.model');
// const { initDevices } = require('./smsProcess');

const { format_number } = require('../utils/formatter');

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



let smsPorts = [];


//Initializing Mysql Database
// const db = mysql.createPool({
//     host     : process.env.HOST,
//     user     : process.env.USER,
//     password : process.env.PASSWORD,
//     database : process.env.DB
//   });

//   db.getConnection(function(err, connection) {
//       if(err) return console.log('DB Error!');
//       console.log('Db Connected')
//     // console.log(connection)
//   });

  const smsDb = mysql.createPool({
    host     : process.env.SMSHOST,
    user     : process.env.SMSUSER,
    password : process.env.SMSPASSWORD,
    database : process.env.SMSDB
  });

  smsDb.getConnection(function(err, connection) {
      if(err) return console.log('DB Error!');
      console.log('Db Connected')
    // console.log(connection)
  });




class CronSend {
    constructor(props) {
        this.interval = props && props.interval ? props.interval : '1';
        this.status = props && props.status ? props.status : [];
        this.com = props && props.com ? props.com : null;
        this.device = props && props.device ? props.device : null;
    }

    static async addRecipient(id, count){
     await MessageModel.getMobtels(count, data => {
      console.log(data)
    });
    return true
  }


    static async sendDevSms({ content, isFlash, isPriority, startAt, com}){
      
      if(!com) return console.log('No device selected!')
      const { mobtels } = dumData;

      let i = 0;
      function nextText(){
          
          if(i > 5) {
              FsServices.setNotBusyDevice(com);
              return console.log('Tamaa na!')
          }
      let mobInt = 0;
      function nextMob(){
          let mob = mobtels[mobInt];
          if(!mob) {
              console.log(mob);
              console.log('Waray mobtel')
              mobInt = 0;
              i++
              return nextText();
          }


       device && device.sendSMS(mob, `${i} --- ${content}`, isFlash, async (result) => {
            console.log('Sendding!')
          if(result && result.status == 'success' && result.data.recipient){
              if(mobInt < mobtels.length){
                  console.log(`Message Sent! ${mobtels[mobInt]}`)
                  mobInt++;
                  return nextMob();
              } 

              console.log(mobInt)
              if(mobInt >= mobtels.length){
                  mobInt = 0;
                  i++
                  return nextText();
              }
           }
           console.log(result);
       });
      }
      nextMob();
    }
  return nextText();


 
    }

    async sendDevSms({ content, isFlash, Mobtels, com}){
        let device = this.device;
        if(!device) return console.log('No device selected!')

        let i = 0;

 
      // console.log(Mobtels)
        let nextText = async (arr) => {
            if(i >= arr.length) {
               await MessageModel.setNotBusyDevice(com);
                // FsServices.setNotBusyDevice(com);
                return console.log('Tamaa na!')
            }
            console.log(arr[i])
          if(!arr[i] || (arr[i] && !arr[i].Mobtel)) return console.log('No Mobtel Data!')  
            let { id, Mobtel } = arr[i];
          let mob = format_number(Mobtel);
            // console.log(device)
         device && device.sendSMS(mob, `${i} --- ${content}`, isFlash, async (result) => {
            if(result && result.status == 'success' && result.data.recipient){
                    await MessageModel.setRecipientSent(id)
                    i++
                    return nextText(arr);
             }
         });
      }
    return nextText(Mobtels);
    }

   async process(){
            
        //Find available device
        let devList = CronSend.getDevices();
        console.log(devList)


        // for(let dev of devList){
        //     // console.log(dev)
        //     let devs = await CronSend.initDevice(dev);
        //     // console.log(devs)
        //     console.log()
        // }
    //    console.log(devList) 
    }

    async processSms(){
            
        //Find available device
        let devList = MessageModel.getDevices();
        let dv = devList.find(a => !a.isBusy);
        if(!dv) return console.log('No Available Device!');

        let ind = portDev.indexOf(dv.path);
        // console.log()
       let message = MessageModel.getUnprocessMessage();
        MessageModel.setBusyDevice(dv.path);
       



       
        // console.log(this.device)

        // for(let dev of devList){
        //     // console.log(dev)
        //     let devs = await CronSend.initDevice(dev);
        //     // console.log(devs)
        //     console.log()
        // }
    //    console.log(devList) 
    }

    static async processSms(){
            
      //Find available device
      let devList = await MessageModel.getDevices();
      if(!devList) return console.log('No Available Device!');

      let dv = devList.find(a => !a.isBusy);
      if(!dv) return console.log('No Available Device!');


      // console.log()
     let message = await MessageModel.getUnprocessMessage(dv.path);
     if(!message) return console.log('No message to be processed');
     const { id, content, isFlash, Mobtels, isCompleted, description } = message;
     console.log(Mobtels)
      if(Mobtels && Mobtels.length == 0 && !isCompleted){
        console.log(description)
        console.log(dv.path)
          // if(!isCompleted && (description == dv.path || Mobtels.length == 0)){
            // console.log('Wawawa')
           await MessageModel.setMessageComplete(id);
           await MessageModel.setMessageUnprocessing(id);
          // }
          return;
        }

      let ind = portDev.indexOf(dv.path);

    if(devices[ind] && devices[ind].device){
     await MessageModel.setBusyDevice(dv.path);
      await MessageModel.setMessageProcessing(id, dv.path);
 
      devices[ind].sendDevSms({
          content, isFlash, Mobtels, com: dv.path
        });
    }
   
  }

    async createBulkSms({content, isFlash, startAt  }){
            
      //Find available device
      let devList = MessageModel.getDevices();
      let dv = devList.find(a => !a.isBusy);
      if(!dv) return console.log('No Available Device!');

      // let ind = portDev.indexOf(dv.path);
      // console.log()
      MessageModel.setBusyDevice(dv.path);

     await MessageModel.getMobtels(startAt, async data => {
       await MessageModel.createMessage({
            content, isFlash, Mobtels: data, startAt
          });
    });
  }

        async initDevice(val){
            
        if(!val) return console.log('No Path')
        let devs = await MessageModel.getDevices();
        const obj = devs.find(a => a.path == val);
        if(!obj) return console.log('cant find device');
        if(obj.isActive) return console.log('Already Active!')


        // const GsmModem = require('./gsmServices');
        const serialportgsm = require('serialport-gsm');
        let GsmModem = new serialportgsm.Modem();

        //  let Gsm = new GsmModem;
        require('./smsServices')(GsmModem);
        await GsmModem.open(val, options);

        obj.isActive = true;
        obj.isBusy = false;

        // console.log('initing')


       await MessageModel.updateDevice(obj);
        this.device = await GsmModem;
        return this.device;
    }

    static async initDevice(val){
        let cwd = process.cwd();
        // let dirPath = path.resolve(cwd, 'processes', 'devices.json');
        // let devList = FsServices.readJsonFile(dirPath);
        
        if(!val) return console.log('No Path')
        let obj = devList.find(a => a.path == val);
        let arr = devList.filter(a => a.path !== val);
        if(!obj) return console.log('Cant Find Device Path');
        if(obj.isActive) return console.log('Device already started!');

        obj.isActive = true;
        arr.push(obj);
        const GsmModem = require('./gsmServices');
        await new GsmModem.open(val, options);

        // await GsmModem.open(val, options);
        const DevGsm = GsmModem;
        [val] = DevGsm;
        // FsServices.writeJsonFile('devices.json', arr)
        return 
    }

    static async stopDevice(val){
      let devList = MessageModel.getDevices();
        
        if(!val) return console.log('No Path')
        let obj = devList.find(a => a.path == val);
        let arr = devList.filter(a => a.path !== val);
        if(!obj) return console.log('Cant Find Device Path');
        if(!obj.isActive) return console.log('Device Not Active');
        obj.isBusy = false;
        obj.isActive = false;
        arr.push(obj);
        console.log(devices)
        devices[val].close();
        delete devices[val] 
            console.log(arr);
        arr.forEach(a => {
          MessageModel.updateDevice(a);
        })
        // FsServices.writeJsonFile('devices.json', arr)
        return obj
    }


 static start(){
    
    
    function cron(ms, fn) {
    let mm = ms * 60000;
        console.log(mm)
    function cb() {
        clearTimeout(timeout)
        timeout = setTimeout(cb, mm)
        fn()
    }

let timeout = setTimeout(cb, mm)

return () => {}
}
    cron(.3, () => {
        CronSend.processSms();
    //   return this.process();
    });
}

 static async getDevices(){
    let devs = await MessageModel.getDevices();
    return devs;
}

static getActiveDevices(){
   return { devices, portDev};
}



 static async initPorts(){

    //  console.log('IIIIIIIIIIINNNNNNNNNNNNNIIIIIIIIIIIIIIIIIIIT!!')
     console.log('Initializing Ports!')
  serialPort.list( async (err,result) => {
    console.log(result)
    console.log(err)
    let arr = [];
    result && result.map(a => {
       arr.push({
         serial: a.serialNumber,
         path: a.path,
         isActive: false,
         isBusy: false
       })
     })

  await MessageModel.initDevices(arr)
  smsPorts = arr
 });
}

 static cronPorts (){
    let indx = 0

const nextPorts = (arrList) => {
    if(indx <= arrList.length) {
        indx++
        return intPorts(arrList);
    }
}


const intPorts = async (arrList) => {


    let obj = arrList[indx];
    
     if(!obj) {
     
      // indx = 0;
        nextPorts(arrList);
      return console.log('No devices!');
     } 
  
    // console.log('obj');
    // console.log(obj)
  
    if(!obj.isActive){
      // console.log(`Activate this ${obj.path}`)
      let gsm = new CronSend({com: obj.path });
      // console.log(obj.path)
       await gsm.initDevice(obj.path)
      let ind = portDev.indexOf(obj.path);
  
      if(ind !== -1){
        devices.splice(ind, 1);
        portDev.splice(ind, 1);
      } 
  
        devices.push(gsm);
        portDev.push(obj.path);
        return  nextPorts(arrList)
    }
  
    return  nextPorts(arrList)
     
  }
  
  
  
  function cron(ms, fn) {
  
    let mm = ms * 60000;
    async function cb() {
    let dvs = await MessageModel.getDevices();
    // console.log(dvs)
  
        let withNull = false;
       devices.forEach(a => {
         if(a.device){
           withNull = true;
         } else {
           withNull = false;
         }
        })
        if(devices.length !== 0 && dvs.length == devices.length && withNull){
        //   console.log('Tapooos and baalllawa')
          return;
        } else {
        //   console.log('Padayonay!')
          clearTimeout(timeout);
          timeout = setTimeout(cb, mm)
          fn()
          return;
        }
   
    }
  
  let timeout = setTimeout(cb, mm)
  
  return () => {}
  }
  
  
  cron(.05, async () => {
    
    let dvs = await MessageModel.getDevices();
    gsmPorts = dvs;
    indx = 0;
    console.log('wewew')
    console.log(gsmPorts)
    dvs.length !== 0 && intPorts(gsmPorts);
  });
}



static async stopPorts(){
    MessageModel.stopPorts();
}
}

 



CronSend.stopPorts();


setTimeout(() => {
  CronSend.cronPorts();
  CronSend.start();
  CronSend.initPorts();
}, 2000)
module.exports = CronSend;