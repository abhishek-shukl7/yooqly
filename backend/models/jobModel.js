const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customers', required: true },
    orderId: { type: Number},
    quantity: { type: Number },
    deadline: { type: Date },
    estimatedCost: { type: String },
    priority: { type: String ,enum: ['Low', 'Medium', 'High','Urgent'], default: 'Medium' },
    requirements: { type: String, required: true },
    comments: { type: String },
    status: { type: String,enum: ['Pending', 'In Production', 'Completed', 'On Hold', 'Cancelled'], default: 'Pending' },
    jobDetails: [{
        type: { type: String , required: true },
        subType: { type: String },
        fields: {
            type: Object,
            default: {}
        }
    }
    ],
}, { timestamps: true });

const jobModel = mongoose.model('Jobs', jobSchema);

module.exports = jobModel;