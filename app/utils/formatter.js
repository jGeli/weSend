exports.format_number = (mobnum) => {
    // let text = `Salamat ${supporter.firstName} ${supporter.lastName} an imo supporta. `
        let num = String(mobnum).trim().split('');
        let ind = num.indexOf('9');
        let resNum = String(mobnum).substring(ind);
        if(String(resNum).length == 10) return `+63${resNum}`;
        return false;
    }


    exports.dataForm = {
        supporter: (val) => {
            const { BarangaySupport, RegionSupport, ProvinceSupport, CitymunSupport } = val;
            let barangay = val.BarangaySupport.brgyDesc;
            let region = val.RegionSupport.regDesc;
            let province = val.ProvinceSupport.provDesc;
            let city = val.CitymunSupport.citymunDesc;
            let mobtel = val.mobtels.length != 0  ? val.mobtels[0].mobtel : "";
            let mobtelId = val.mobtels.length != 0  ? val.mobtels[0].id : "";
            let address = { brgyCode: BarangaySupport.brgyCode, citymunCode: CitymunSupport.citymunCode, provCode: ProvinceSupport.provCode, regCode: RegionSupport.regCode  }
            // console.log(val)
    
            return {
                id: val.id,
                fullName: `${val.lastName}, ${val.firstName}${val.middleName ? ' '+val.middleName : ''}`,
                age: val.age,
                isVerified: val.isVerified,
                region, province, city, barangay,
                mobtel,
                mobtelId,
                address
            }
        },
        smsForm: (data) => {
            let { Mobtels, id, content, isFlash, isCompleted, isDeleted, createdAt, totalSent } = data;
            let arr = Mobtels ? Mobtels : []
           let arrs = arr.map(a => {
                let { isSent, Mobtel, sentAt } = a;
                return {
                    id: a.id,
                    mobile: this.format_number(Mobtel),
                    isFlash, isSent, sentAt
                }
            })
    
            return {
                id, content, isFlash, isCompleted, isDeleted, createdAt, recipients: arrs, totalSent
            }
        },
    
        recipientForm: (data) => {
            return this.format_number(data)
        }
    }