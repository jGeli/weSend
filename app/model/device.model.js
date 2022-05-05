const db = require("../models");
const Devices = db.device;
const Simpak = db.simpak;

const Op = db.Sequelize.Op;
const sequelize = db.Sequelize;



class DeviceModel{

    static async initDevice({description, mobtel, serial, path}){
        console.log(serial)
           let device = await Devices.findOne({where: { serial: serial }})
           .then(doc => {
               console.log(doc)
           })
           .catch(err => {
               console.log(err)
           })
           
           ;


            if(device){
                return await Devices.update({ description: description, mobtel: mobtel, serial: serial, path: path, status: 'Active'  }, { returning: true, where: { id: device.id } })
                    .then(doc => {
                        console.log(doc)
                        return Devices.findByPk(device.id);
                    })
                    .catch(err => {
                        console.log(err)
                        return err
                    })
            } else {
                return await Devices.create({
                    description: description, 
                    mobtel: mobtel, 
                    serial: serial, 
                    path: path
                })   
            }
    }

    static async updateDevice(id, data){
        let options = {};
        Object.entries(data).forEach((a, b) => {
            console.log(a)
            console.log(b)
        })

      return await Devices.update(options, { where: { id: id }, returning: true })
        .then(async doc => {
            return await Devices.findByPk(doc.id);
        })
        .catch(err => {
            console.log(err)
            return err
        })

    }

    static async setDeviceTag({id, tag}){
        console.log(id)
        console.log(tag)
            
    }

    static async setDeviceStatus({content, isFlash, Mobtels, startAt}){
            
    }

    static async stopDevice(id){
        return await Devices.update({status: 'Inactive'}, { where: { id: id }, returning: true })
        .then(async doc => {
            return await Devices.findByPk(id);
        })
        .catch(err => {
            console.log(err)
            return err
        })
    }
}

module.exports = DeviceModel;