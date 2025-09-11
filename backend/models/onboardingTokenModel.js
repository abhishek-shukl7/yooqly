const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

const onboardingTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

onboardingTokenSchema.statics.generateToken = function(email,roles) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); 
    return this.create({ token, email,roles, expiresAt });
};

const OnboardingToken = mongoose.model('OnboardingToken', onboardingTokenSchema);

module.exports = OnboardingToken;
