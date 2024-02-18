const mongoose = require('mongoose');
const mongoURL = "mongodb://127.0.0.1:27017/iNotebook?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1";

const connectMog = () => {
  mongoose.connect(mongoURL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error occurred, not connected to the database");
    });
};

module.exports = connectMog;
