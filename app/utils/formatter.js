exports.format_number = (mobnum) => {
    // let text = `Salamat ${supporter.firstName} ${supporter.lastName} an imo supporta. `
        let num = String(mobnum).trim().split('');
        let ind = num.indexOf('9');
        let resNum = String(mobnum).substring(ind);
        if(String(resNum).length == 10) return `+63${resNum}`;
        return false;
    }