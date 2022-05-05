const MessageModel = require("../app/services/message.model");
const CleanerModel = require('../app/model/cleaner.model');








const handleSmsReach = async () => {
    let accs = await CleanerModel.getAccounts();
        accs && accs.forEach(a => {
            CleanerModel.setAccountSmsReach(a.id)
        });
}








async function init(){

    setInterval( async () => {
        await MessageModel.setMessagesUnprocessing();
        let messages = await MessageModel.getIncompleteMessage();
        messages.forEach((a) => {
            let { id, Mobtels } = a;
            let ind = Mobtels.find(ab => !ab.isSent);
            if(!ind){
                MessageModel.setMessageComplete(id);
            }
        })
            handleSmsReach()
}, 60000)

}

init();

// MessageModel.resetMessages()
