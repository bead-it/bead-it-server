const mongoose = require('mongoose');

const dbConnect = () => {
  try {
    mongoose.connect(process.env.MONGO_DB);
    console.log('DB Connected');
  } catch (error) {
    console.error('Error during connecting to mongo_db : ', error);
  }
};

module.exports = dbConnect;
