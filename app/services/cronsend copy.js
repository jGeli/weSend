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
      let nextText = () => {
          
          if(i > 5) {
              FsServices.setNotBusyDevice(com);
              return console.log('Tamaa na!')
          }
      let mobInt = 0;
      let nextMob = () => {
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
        if(!com) return console.log('No device selected!')
        const { mobtels } = dumData;

        let i = 0;
        let nextText = () => {
            
            if(i > 5) {
                FsServices.setNotBusyDevice(com);
                return console.log('Tamaa na!')
            }
        let mobInt = 0;
        let nextMob = () => {
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
        let devList = FsServices.readDevices();
        console.log(devList)
        let dv = devList.find(a => !a.isBusy);
        console.log(dv)
        if(!dv) return console.log('No Available Device!');

        let ind = portDev.indexOf(dv.path);
        // console.log()
       let message = MessageModel.getUnprocessMessage();
        FsServices.setBusyDevice(dv.path);
       



       
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
      let devList = FsServices.readDevices();
      console.log(devList)
      let dv = devList.find(a => !a.isBusy);
      console.log(dv)
      if(!dv) return console.log('No Available Device!');

      let ind = portDev.indexOf(dv.path);
      // console.log()
     let message = await MessageModel.getUnprocessMessage();
     if(!message) return console.log('No message to be processed');
     const { content, isFlash, Mobtels } = message;
    if(devices[ind] && devices[ind].device){
      FsServices.setBusyDevice(dv.path);
        devices[ind].sendDevSms({
          content, isFlash, Mobtels, 
        });
    }
      // console.log(this.device)

      // for(let dev of devList){
      //     // console.log(dev)
      //     let devs = await CronSend.initDevice(dev);
      //     // console.log(devs)
      //     console.log()
      // }
  //    console.log(devList) 
  }

    async createBulkSms({content, isFlash, startAt  }){
            
      //Find available device
      let devList = FsServices.readDevices();
      let dv = devList.find(a => !a.isBusy);
      if(!dv) return console.log('No Available Device!');

      // let ind = portDev.indexOf(dv.path);
      // console.log()
     FsServices.setBusyDevice(dv.path);

     await MessageModel.getMobtels(startAt, async data => {
      console.log(data)
        let message = await MessageModel.createMessage({
            content, isFlash, Mobtels: data, startAt
          });
          console.log(message)
    });


      // devices[ind].sendDevSms({
      //     content, isFlash, isPriority, startAt, com: dv.path
      //   });

     
      // console.log(this.device)

      // for(let dev of devList){
      //     // console.log(dev)
      //     let devs = await CronSend.initDevice(dev);
      //     // console.log(devs)
      //     console.log()
      // }
  //    console.log(devList) 
  }


        async initDevice(val){
            
        if(!val) return console.log('No Path')
        let devs = FsServices.readDevices();
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


        FsServices.updateDevice(obj);
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
        let cwd = process.cwd();
        let dirPath = path.resolve(cwd, 'processes', 'devices.json');
        let devList = FsServices.readJsonFile(dirPath);
        
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
        FsServices.writeJsonFile('devices.json', arr)
        return obj
    }

    static async initDevices(){
        let res = [];
        let cwd = process.cwd();
        let dirPath = path.resolve(cwd, 'processes', 'devices.json');

        let devList = FsServices.readJsonFile(dirPath)

        let arr = [];
      for(const dev of devList){
        //   console.log(dev)
          if(!dev.isActive){
            let GsmModem = require('./gsmServices');
            await new GsmModem.open(dev.path, options);
            dev.path == 'COM5' ? COM5 = GsmModem :    
            dev.path == 'COM3' ? COM3 = GsmModem : null; 


            let obj = {
                ...dev,
                isActive: true
            }
            arr.push(obj);
            res.push(obj);
          } else {
              arr.push(dev);
          }
      }

    //   console.log(arr)

        // FsServices.writeJsonFile('devices.json', arr)
        return res
    }

    start(){
        console.log('Cron Starting')
        const { interval } = this;
        
        
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
        cron(interval, () => {
            // CronSend.initPorts();
        //   return this.process();
        });
 }

 static start(){
    console.log('Cron Starting')
    // const { interval } = this;
    
    
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
    cron(.2, () => {
        CronSend.processSms();
    //   return this.process();
    });
}

 static getDevices(){
     this.initPorts();
    let cwd = process.cwd();
    let dirPath = path.resolve(cwd, 'processes', 'devices.json');
    let devList = FsServices.readJsonFile(dirPath)
    return smsPorts;
}

static getActiveDevices(){
   return { devices, portDev};
}



 static async initPorts(){

    //  console.log('IIIIIIIIIIINNNNNNNNNNNNNIIIIIIIIIIIIIIIIIIIT!!')
     console.log('Initializing Ports!')
  serialPort.list( async (err,result) => {
 let resArr = FsServices.addDevices(result)
// console.log(resArr)
  smsPorts = resArr
 });
}

 static cronPorts (){
    let indx = 0

const nextPorts = (arrList) => {
    if(indx < arrList.length) {
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
    function cb() {
    let dvs = FsServices.readDevices();
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
  
  
  cron(.1, () => {
    
    let dvs = FsServices.readDevices();
    gsmPorts = dvs;
    indx = 0;
    dvs.length !== 0 && intPorts(gsmPorts);
  });


}
}


// FsServices.writeJsonFile('devices.json', []);
CronSend.start();
CronSend.cronPorts();
CronSend.initPorts();
module.exports = CronSend;