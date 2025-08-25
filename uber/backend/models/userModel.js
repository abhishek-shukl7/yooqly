const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id:this._id },process.env.JWT,{ expiresIn: '24h'});
    return token;
}

userSchema.methods.comparePwd = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPwd = async function(password){
    return await bcrypt.hash(password,10);
}

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;