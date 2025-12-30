const mongoose = require('mongoose');
const { Schema } = mongoose;

const productionJobDetailSchema = new Schema({
    type: { type: String, required: true },
    subType: { type: String },
    fields: { type: Object, default: {} },
    status: { type: String, enum: ["Queued", "In-Production", "Ready for Dispatch", "Completed"], default: 'Queued' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    completed: { type: Number, default: 0 },
    lineItemId: { type: String }
}, { _id: false });

const productionJobSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customers', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Jobs', required: true },
    quoteId: { type: Schema.Types.ObjectId, ref: 'Quote' },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    orderId: { type: Number },
    jobDetails: { type: [productionJobDetailSchema], default: [] },
    productionStatus: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Paused'], default: 'Not Started' },
    productionStartDate: { type: Date },
    productionDeadline: { type: Date, default: null }
}, { timestamps: true });

const productionJobModel = mongoose.model('ProductionJob', productionJobSchema);

module.exports = productionJobModel;
