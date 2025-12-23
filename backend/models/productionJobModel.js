const mongoose = require('mongoose');
const { Schema } = mongoose;

const productionJobDetailSchema = new Schema({
    type: { type: String, required: true },
    subType: { type: String },
    fields: { type: Object, default: {} },
    status: { type: String, enum: ['Pending', 'In Production', 'Completed', 'On Hold', 'Cancelled'], default: 'Pending' }
}, { _id: false });

const productionJobSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Jobs', required: true },
    quoteId: { type: Schema.Types.ObjectId, ref: 'Quote' },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    jobDetails: { type: [productionJobDetailSchema], default: [] },
    productionStatus: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Paused'], default: 'Not Started' },
    productionStartDate: { type: Date },
    productionEndDate: { type: Date }
}, { timestamps: true });

const productionJobModel = mongoose.model('ProductionJob', productionJobSchema);

module.exports = productionJobModel;
