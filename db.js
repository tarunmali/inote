const mongoose = require('mongoose');
const mongoURI = ('mongodb+srv://TusharV:th6r6nper3@cluster0.mrdddqu.mongodb.net/test');

const connect = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected with Mongo Successfully");
    });
}

module.exports = connect;