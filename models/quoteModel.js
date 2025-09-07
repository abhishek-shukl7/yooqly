const mongoose = require('mongoose');
const { Schema } = mongoose;

const quoteItemSchema = new Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
});

const quoteSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customers', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    orderId: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quoteDeadline: { type: Date },
    status: { type: String, required: true, enum: ['draft', 'sent', 'approved', 'rejected'], default : 'draft' },
    tax: { type: String },
    terms: { type: String },
    requirements : { type: String },
    quoteTotal: { type: Number, required: true },
    quoteItems: [quoteItemSchema]
}, { timestamps: true });

const quoteModel = mongoose.model('Quote', quoteSchema);

module.exports = quoteModel;