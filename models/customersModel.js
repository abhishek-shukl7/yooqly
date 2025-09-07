const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    customerName: { type: String, required: true },
    customerCompanyName: { type: String },
    customerEmail: { type: String, required: true },
    phone: { type: String,required: true },
    address: { type: String }
}, { timestamps: true });

const customerModel = mongoose.model('Customers', customerSchema);

module.exports = customerModel;