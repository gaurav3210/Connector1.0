const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');


const connectDB = async() => {
    try {
       await mongoose.connect(db, { useUnifiedTopology: true ,useNewUrlParser: true, useCreateIndex: true });
       console.log("MONGO DB");
    } catch (e) {
        console.error(e.message);
        process.exit(1);

    }

}

module.exports = connectDB;