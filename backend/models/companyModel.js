const mongoose = require('mongoose');
const { Schema } = mongoose;

const companySchema = new Schema({
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true, unique: true, minlength: [5, 'Email must be at least 5 characters long'], },
    logoUrl: { type: String },
    timezone: { type: String },
    currency: { type: String, required: true, default: 'GBP' },
    currencySymbol: { type: String, default: '£' },
    isActive: { type: Boolean, default: true },
    alertSettings: { type: Object },
    emailSettings: {
        enabled: { type: Boolean, default: true },
        jobCreated: { type: Boolean, default: true },
        quoteSent: { type: Boolean, default: true },
        quoteStatus: { type: Boolean, default: true },
        customerWelcome: { type: Boolean, default: true },
        userRegistered: { type: Boolean, default: true },
        productionUpdate: { type: Boolean, default: true },
        productionCompleted: { type: Boolean, default: true },
        onboarding: { type: Boolean, default: true }
    }
}, { timestamps: true });

const companyModel = mongoose.model('Company', companySchema);

module.exports = companyModel;