require('dotenv').config();
module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    Port: 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 120000,
      idle: 5000
    }
  };