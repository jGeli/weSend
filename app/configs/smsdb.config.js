require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createPool({
    host     : process.env.SMSHOST,
    user     : process.env.SMSUSER,
    password : process.env.SMSPASSWORD,
    database : process.env.SMSDB,
    port: 3306,
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
  });






module.exports = db;