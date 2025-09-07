const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: [String], required: true, enum: ['quote', 'quote-approval', 'order-intake','orders','production','audit'] , default: [] },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true }, 
    isSuperAdmin: { type: Boolean, default: false },
    lastLogin: { type: Date }
}, { timestamps: true });

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

const usersModel = mongoose.model('Users', userSchema);

module.exports = usersModel;