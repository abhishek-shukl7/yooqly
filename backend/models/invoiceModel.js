const mongoose = require('mongoose');
const { Schema } = mongoose;

const invoiceSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customers', required: true },
    quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Number, required: true },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    status: { type: String, required: true, enum: ['pending', 'paid', 'overdue', 'cancelled'] },
    invoiceTotal: { type: Number }
}, { timestamps: true });

const invoiceModel = mongoose.model('Invoice', invoiceSchema);

module.exports = invoiceModel;