const { validationResult } = require('express-validator');
const onboardingService = require('../services/onboardingService');
const OnboardingToken = require('../models/onboardingTokenModel');
const emailWorker = require('../services/emailWorker');

exports.onboardClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { token } = req.params;
        const { companyName, companyEmail, currency, timezone, logoUrl, alertSettings, password, name } = req.body;
;
        const companyData = { companyName, companyEmail, currency, timezone, logoUrl, alertSettings };

        const userData = { name, password};

        const onboardingData = await onboardingService.onboardClient(token, companyData, userData);
        
        return res.status(201).json({ message: 'Account created successfully.', data: onboardingData });
    } catch (err) {
        console.error('Onboarding failed:', err);
        return res.status(400).json({ message: err.message });
    }
};


exports.sendOnboardingLink = async(req,res) => {
    const {email,roles,code} = req.body;

    try {
        if(code !== process.env.CODE){
            return res.status(403).json({ error: 'Forbidden' });
        }
        const tokenDoc = await OnboardingToken.generateToken(email,roles);
        const token = tokenDoc.token;

        const onboardingUrl = process.env.API_BASE_URL+ `/api/onboarding/onboarding-client/token/${token}`;

        // Use emailWorker to send the onboarding email
        const mailOptions = {
            from: 'testclient@hackersdaddy.com',
            to: email,
            subject: 'Welcome! Complete Your Account Setup',
            html: `
                <p>Welcome to our platform!</p>
                <p>Please click the link below to set up your company account and create your admin profile:</p>
                <a href="${onboardingUrl}">Set Up Your Account</a>
                <p>This link will expire in 24 hours.</p>
            `,
        };
        const mailResult = await emailWorker.sendEmail(mailOptions);

        return res.status(200).json({ message: `Onboarding link sent to ${email}` });
    } catch (error) {
        console.error(`Failed to send onboarding link to ${email}:`, error);
        return res.status(500).json({ message: 'Could not send onboarding link', error: error.message });
    }
}