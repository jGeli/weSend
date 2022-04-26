const controller = require("../controllers/sms.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

app.post("/api/sms/send",
    controller.sendSms);

// app.post("/api/sms/resend/:id",
//     controller.resendSms);

  // app.post("/api/sms/contacts", controller.addContacts);

  //GET
 
//   app.get("/api/test",
// controller.testSms);
  // app.get("/api/sms/contacts", controller.getContacts);
  // app.get("/api/sms/contacts/all", controller.getAllContacts);
  // app.get("/api/sms/test/:short", controller.testEndpoint);



app.get("/api/sms",
controller.getSmsAll);

// app.get("/api/sms/:id",
// controller.getSms);

// app.put('/api/sms/update/:id', [
//   authJwt.verifyToken, 
//   // authJwt.isAdmin
// ], controller.updateSms)

// app.delete('/api/sms/delete/:id', [
//   authJwt.verifyToken, 
//   // authJwt.isAdmin
// ], controller.deleteSms)



// app.get("/api/gsm/restart",
// // [
// //   authJwt.verifyToken, 
// // ], 
// portController.checkGsmPorts);

// app.get("/api/gsm/ports",
// // [
// //   authJwt.verifyToken, 
// // ], 
// portController.checkGsmPorts);


};







