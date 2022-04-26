const fs = require('fs');
const path = require('path');

class FsServices {

       //Devices


    //Generate FileName
   static generateFilename(){
        let now = new Date();
       const dtf = (val) => {
            return val <= 9 ? `0${val}` : val;
        }
        let fileName = `${now.getFullYear()}${dtf(now.getMonth() + 1)}${dtf(now.getDate())}-${dtf(now.getHours())}${dtf(now.getMinutes())}.json`;
        return fileName;
    }  
    
    // Write File
   static writeJsonFile(filePath, data){
        
        let cwd = process.cwd();
        let pt = path.resolve(cwd, process.env.dirPath, filePath);
        if(typeof data == 'object'){
            return fs.writeFile(pt, JSON.stringify(data), (err) => {
                if (err) { 
                    console.log(err);
                }
                return;
            });
        } else {    
            return fs.writeFile(pt, data, (err) => {
                if (err) { 
                    console.log(err);
                }
                return;
            });
        }
       


        // }
        // let content = typeof data == 'string' ? data : JSON.stringify(data); 
    
            // return data
}

    // Read File
    static readJsonFile(fileName){ 
    
        let fsData = fs.readFileSync(fileName, 'utf8');
        console.log('reading!')
        console.log(!fsData)
        if(!fsData) return [];

        // console.log(typeof fsData)
        if(typeof fsData !== 'string'){
            return fsData
        }
            return JSON.parse(fsData);
        // let tp = typeof fsData == 'string' ? JSON.parse(fsData) : fsData; 
        // return tp
}

    //Check or Create
    static checkOrCreatePath(filePath){

        let arr = [];
        
        if (!fs.existsSync(filePath)){
        
            console.log(`${filePath} directory not Exist!`)
        
            fs.mkdirSync(filePath, { recursive: true });
        
        }
        
        const files = fs.readdirSync(filePath);
        
        for(const file of files){
        
            let loc = path.resolve(filePath, file);
        
            arr.push(loc);
        
        }
        
        return arr
    
    }


    static updateJsonFile(filePath, data){
    let content = typeof data == 'string' ? data : JSON.stringify(data); 
    fs.writeFile(filePath, content, (err) => {
            if (err) console.log(err);
        // console.log(`Write file`)
      return;
    } 
    );
    return filePath;
    }

     //Delete File
    static deleteJsonFile(file){
        if (fs.existsSync(file)) {
        fs.unlinkSync(file);
                return true;
            } else {
                return false;
        }   
    }



    static addDevice(val){
        let cwd = process.cwd();
        let dirPath = path.resolve(cwd, 'processes', 'devices.json');

        let devList = FsServices.readJsonFile(dirPath);

        if(devList){
            let ind = devList.indexOf(val);
            if(ind == -1){
                devList.push(val);
                FsServices.writeJsonFile('devices.json', devList); 
                return true
            }
        }

        FsServices.writeJsonFile('devices.json', [val]); 
        return true;
    }

    static addDevices(val){

        let devList = this.readDevices();
        let arr = [];
        // arr = devList;
        if(val){
            // console.log(devList)
            let res = val.map(a => {
                let ind = devList.find(ab => ab.path == a.path && !ab.isBusy);
                return ind ? {
                     ...a 
                } : {
                     path: a.path, isBusy: false, isActive: false
                }
                    // ind ? arr.push(ind) : arr.push({serial: a.serialNumber, path: a.path, isBusy: false, isActive: false});
            })

            console.log('adding deevicess')
            console.log(res)
            FsServices.writeJsonFile('devices.json', res); 
            return res
        }

        // FsServices.writeJsonFile('devices.json', val); 
        // console.log(devList)
        // console.log(devList)
    //    let arr = devList.filter(a => a.path != val);
    //     console.log(val)
    //     console.log(devList)
    //     console.log(arr)
    //     
        // console.log(devList)
        return arr;
    }

    static updateDevice(val){
        let cwd = process.cwd();
        let dirPath = path.resolve(cwd, 'processes', 'devices.json');

        let devList = FsServices.readJsonFile(dirPath);
        let arr = [];
        // arr = devList
        if(devList){
            arr = devList.map(a => { return a.path});
            let ind = arr.indexOf(val.path);
            console.log(ind)
            if(ind == -1) return console.log('Cant find device');
            devList[ind] = val;
            FsServices.writeJsonFile('devices.json', devList); 
            return true
        }

    

        FsServices.writeJsonFile('devices.json', [val]); 
        // console.log(devList)
        // console.log(devList)
    //    let arr = devList.filter(a => a.path != val);
    //     console.log(val)
    //     console.log(devList)
    //     console.log(arr)
    //     

        // console.log(devList)
        return true;
    }

    static removeDevice(val){
        let cwd = process.cwd();
        let dirPath = path.resolve(cwd, 'processes', 'devices.json');

        let devList = FsServices.readJsonFile(dirPath);
        
       let arr = devList.filter(a => a.path != val);
        // console.log(val)
        // console.log(devList)
        // console.log(arr)
        FsServices.writeJsonFile('devices.json', arr);

        // console.log(devList)
        return true;
    }

    static setBusyDevice(val){
        let cwd = process.cwd();
        let dirPath = path.resolve(cwd, 'processes', 'devices.json');

        let devList = FsServices.readJsonFile(dirPath);
        
       let arr = devList.map(a => {

            return val == a.path ? {
                ...a,
                isBusy: true
            } : a;  
        });

        // console.log(val)
        // console.log(devList)
        // console.log(arr)
        FsServices.writeJsonFile('devices.json', arr);

        // console.log(devList)
        return true;
    }

    static setNotBusyDevice(val){
        let cwd = process.cwd();
        let dirPath = path.resolve(cwd, 'processes', 'devices.json');

        let devList = FsServices.readJsonFile(dirPath);
        
       let arr = devList.map(a => {

            return val == a.path ? {
                ...a,
                isBusy: false
            } : a;  
        });

        // console.log(val)
        // console.log(devList)
        // console.log(arr)
        FsServices.writeJsonFile('devices.json', arr);

        // console.log(devList)
        return true;
    }

    static readDevices(){ 
        const cwd = process.cwd();
        let pathDir = path.resolve(cwd, 'processes', 'devices.json');
        let fsData = fs.readFileSync(pathDir, 'utf8');
        console.log('reading!')
        if(!fsData) return [];

        if(typeof fsData !== 'string'){
            return fsData
        }
            return JSON.parse(fsData);
}
}

module.exports = FsServices