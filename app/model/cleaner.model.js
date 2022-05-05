const db = require('../models');

const Account =  db.account;
const Message = db.messages;




class CleanerModel{
    static async getAccounts(){
        let accs = await Account.findAll();
        return accs;
    } 

    static async setAccountSmsReach(id){
        let msgs = await CleanerModel.getMessageByUserId(id)
        let count = 0;
        msgs && msgs.forEach(a => {
            count += a.totalSent;
        });
        return await Account.update({ smsReach: count },{ where: { userId:id }  });
    }


    static async getMessageByUserId(id){
        let msgs = await Message.findAll({where: { userId: id }});
        return msgs
    }

}



module.exports = CleanerModel