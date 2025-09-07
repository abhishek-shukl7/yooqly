const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditLogSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tableName: { type: String, required: true, enum: ['jobs', 'quotes','customers','invoice'] },
    recordId: { type: Schema.Types.ObjectId, required: true },
    changeType: { type: String, required: true, enum: ['create', 'update', 'delete'] },
    oldData: { type: Schema.Types.Mixed }, 
    newData: { type: Schema.Types.Mixed }
}, { timestamps: true });

const auditModel = mongoose.model('Audit', auditLogSchema);

module.exports = auditModel;