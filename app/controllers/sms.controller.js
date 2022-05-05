const db = require("../models");
const Message = db.messages;
const Recipient = db.recipients;
const Op = db.Sequelize.Op;

const CronSend = require('../services/cronsend');
const MessageController = require('./message.controller');
const { dataForm } = require('../utils/formatter');


let devices = [];
let portDev = [];


setInterval(() => {
    devs = CronSend.getActiveDevices();
    devices = devs.devices;
    portDev = devs.portDev;
   }, 5000)

const getPagination = (page, size) => {
    const limit = size ? +size : 500;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: messages } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, messages, totalPages, currentPage };
  };


exports.sendSms = async (req, res) => {
        try {
          let rs = await  MessageController.createMessage(req.body);
          console.log(rs)
            res.status(200).json('Message Sent!');    
        } catch(err){
            console.log(err)
            return res.status(400).json({ err, message: { text: 'Sending Failed!', type: 'error'}});
        }
};

exports.getSmsAll = (req, res) => {
  const { page, size, userId } = req.query;
  const { limit, offset } = getPagination(page, size);

  Message.findAndCountAll({ 
    include: [ 
      { model: Recipient,  as: 'Mobtels', required: false},
    ],
    order: [['id', 'DESC']],
    where: { 
      [Op.and]: [{userId: userId ? userId : null}, {isDeleted: false }]
    },  
    limit, offset, distinct: true
  })
    .then(data => {
      if(!data || data.length == 0) return res.status(400).json({message: 'Cant find this message!'})


      let arr = [];
        let { messages, totalItems, totalPages,  currentPage } = getPagingData(data, page, limit);
        
        messages.forEach(ab => {
            arr.push(dataForm.smsForm(ab));
        })
        res.status(200).json({totalItems, totalPages,  currentPage, messages: arr});
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
