const { validationResult } = require('express-validator');
const onboardingService = require('../services/onboardingService');
const OnboardingToken = require('../models/onboardingTokenModel');
const nodemailer = require('nodemailer'); 

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
    const clientEmail = req.body.email;
    try {
        const tokenDoc = await OnboardingToken.generateToken(clientEmail);
        const token = tokenDoc.token;

        // Step 2: Construct the secure URL
        const onboardingUrl = `http://localhost:3001/onboarding?token=${token}`;
        console.log('Generated Onboarding URL:', onboardingUrl);
        // Step 3: Send the email
        const transporter = nodemailer.createTransport({ /* your email service config */ });
        await transporter.sendMail({
            from: '"Yooqly"<no-reply@yooqly.com>',
            to: clientEmail,
            subject: 'Welcome! Complete Your Account Setup',
            html: `
                <p>Welcome to our platform!</p>
                <p>Please click the link below to set up your company account and create your superadmin profile:</p>
                <a href="${onboardingUrl}">Set Up Your Account</a>
                <p>This link will expire in 24 hours.</p>
            `,
        });

        console.log(`Onboarding link sent to ${clientEmail}`);
    } catch (error) {
        console.error(`Failed to send onboarding link to ${clientEmail}:`, error);
        throw new Error('Could not send onboarding link.');
    }
}