const mongoose = require('mongoose');
const { Schema } = mongoose;

const companySchema = new Schema({
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true, unique: true,minlength: [ 5, 'Email must be at least 5 characters long' ],},
    logoUrl: { type: String },
    timezone: { type: String },
    currency: { type: String , required: true},
    isActive: { type: Boolean, default: true },
    alertSettings: { type: Object } 
}, { timestamps: true });

const companyModel = mongoose.model('Company', companySchema);

module.exports = companyModel;