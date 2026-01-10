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
    const {email,roles,code} = req.body;
    console.log('req.body',req.body);
    try {
        if(code !== process.env.CODE){
            res.status(403).json({ error: 'Forbidden' });
        }
        const tokenDoc = await OnboardingToken.generateToken(email,roles);
        const token = tokenDoc.token;
        
        const onboardingUrl = process.env.API_BASE_URL+ `api/onboarding?token=${token}`;
        console.log('Generated Onboarding URL:', onboardingUrl);

        const transporter = nodemailer.createTransport({
        host: '213.210.21.18',
        port: 1025,
        secure: false, 
        auth: {
            username: "admin",
            password: "admin"
        }
        });
        const test = await transporter.sendMail({
            from: '"Yooqly"<no-reply@yooqly.com>',
            to: email,
            subject: 'Welcome! Complete Your Account Setup',
            html: `
                <p>Welcome to our platform!</p>
                <p>Please click the link below to set up your company account and create your superadmin profile:</p>
                <a href="${onboardingUrl}">Set Up Your Account</a>
                <p>This link will expire in 24 hours.</p>
            `,
        });
        console.log('email send',test);

        console.log(`Onboarding link sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send onboarding link to ${email}:`, error);
        throw new Error('Could not send onboarding link.');
    }
}