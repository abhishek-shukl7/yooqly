const mongoose = require("mongoose");

function connectDB(){
    mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo DB Connected');
    }).catch(err => {
        console.log('MongoDB error',err);
    })
}

module.exports = connectDB;