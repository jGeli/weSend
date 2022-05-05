const db = require("../models");
const Devices = db.device;
const Simpak = db.simpak;

const Op = db.Sequelize.Op;



class DeviceModel{

    static async initDevice({description, mobtel, serial, path}){
            let sim = await Simpak.findOne({where: { mobtel: mobtel} })
                        .then(async doc => {
                            // console.log(doc)
                            if(!doc){
                             return await Simpak.create({
                                    mobtel: mobtel
                                })
                            } 
                            return doc
                        });


            // console.log(sim);
           let device = await Devices.findOne({where: { serial: serial }});
          


            if(device){
                return await Devices.update({ description: description, mobtel: mobtel, serial: serial, path: path, status: 'Active', simpakId: sim.id  }, { returning: true, where: { id: device.id } })
                    .then(doc => {
                        sim.deviceId = device.id;
                        sim.save();
                        return device;
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
                    path: path,
                    simpakId: sim.id,
                    status: 'Active'
                })
                .then(doc => {
                    sim.deviceId = doc.id;
                    sim.save();
                    return doc;
                }) 
                .catch(err => {
                    console.log(err)
                    return err
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

    static async stopDevice(path){
        return await Devices.update({status: 'Inactive'}, { where: { path: path }, returning: true })
        .then(async doc => {
            console.log(doc)
            return path;
        })
        .catch(err => {
            console.log(err)
            return err
        })
    }
}

module.exports = DeviceModel;