require('dotenv').config();
const serialPort = require('serialport-gsm');
const mysql = require('mysql');
const path = require('path');
const db = require("../models");


const device = db.device;



const GsmModem = require('./gsmServices');
const FsServices = require('./fsServices');
const MessageModel = require('./message.model');



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

let deviceStatus = [];
let devices = {};


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



class SmsProcess {
    constructor(props) {
        this.interval = props && props.interval ? props.interval : '10';
        this.status = props && props.status ? props.status : [];
        this.devices = props && props.devices ? props.devices : [];
    }

    findDevice(){

    let data = FsServices.readJsonFile()

        return devices;
    }

    checkDeviceStatus(){
        // this.getD();
        console.log(this.status.length)
        let arr = []
        arr = smsPorts;

        smsPorts.map(a => {
            arr.push(a);
        })

        smsPorts = arr;
        // smsPorts = [...smsPorts, this.status];
        return this.status;
    }

    static async createMessage(){

          let mobtels = MessageModel.getMobtels();
          console.log(mobtels);

            

           // return 'Cron is running!'
    }

    static start(){
        // const { interval } = this.state;

        // console.log(this.star)

        function cron(ms, fn) {
            let mm = ms * 60000;
            function cb() {
                clearTimeout(timeout)
                timeout = setTimeout(cb, mm)
                fn()
            }

            // console.log(mm)
            let timeout = setTimeout(cb, mm)
            return () => {}
        }

        cron(.1, () => {
            // console.log(this.interval)
            // console.log('Croon is Running!');
            // SmsProces
            // let hm =  new SmsProcess({
            //     status: ['Myda na', 'myda pa']
            // }).checkDeviceStatus();
            // console.log(hm);
        SmsProcess.status();
        // console.log(status)
        });
        // return 'Cron is running!'
    }

    static status(){
            return smsPorts;
    }

    static initPorts(){
          serialPort.list((err,result) => {
              let obj = [];
                result.map(a => {
                    obj.push({
                        // serial: a.serialNumber,
                        path: a.path,
                        isBusy: false
                    })
             })
        // console.log(result)
        FsServices.writeJsonFile('devices.json', obj)
        smsPorts = result
    });
}

static setDevices(){
    serialPort.list((err,result) => {
        // console.log(result)
        smsPorts = result
    });
}

static async initDevices(val){
    if(!val) return null
    devices[val] = await GsmModem.open(val, options);
    return devices[val]
}

static getMessage(){

        let sqlQuery = `SELECT *
        FROM ${process.env.DB}.messages ORDER BY id;`

  //MYSQL Querying callback function.   
    db.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
        let cwd = process.cwd();
        console.log(cwd)
        // FsServices.writeJsonFile(`./${cwd}`)
        console.log(results)
  })
}

static getDevices(){
    return devices;
}

static getPorts(){
    return smsPorts;
}

static checkStatus() {
        return smsPorts;
}
}


//Initialize auditLog class functions with writeoutput function.
// new auditLog().writeOutput();

//Initialize auditLog class function with  writeoutput function running w/n a cron job.
// SmsProcess.getDevices();
// SmsProcess.start();
// SmsProcess.checkStatus();




// SmsProcess.start();
// SmsProcess.getDevices();
// SmsProcess.initPorts();
module.exports = SmsProcess;