const MessageModel = require("../app/services/message.model");

function init(){

    setInterval( async () => {
        let messages = await MessageModel.getIncompleteMessage();
        messages.forEach((a) => {
            let { id, Mobtels } = a;
            let ind = Mobtels.find(ab => !ab.isSent);
            if(!ind){
                MessageModel.setMessageComplete(id);
            }
        })
}, 30000)

}

init();

// MessageModel.resetMessages()
