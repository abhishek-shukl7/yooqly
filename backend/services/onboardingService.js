const bcrypt = require('bcryptjs');
const OnboardingToken = require('../models/onboardingTokenModel');
const Company = require('../models/companyModel');
const User = require('../models/usersModel');
const redisClient = require("../config/redis");

module.exports.onboardClient = async (token, companyData, userData) => {

    const onboardingToken = await OnboardingToken.findOne({ token });

    if (!onboardingToken || onboardingToken.expiresAt < new Date()) {
        throw new Error('Invalid or expired onboarding token.');
    }
    // console.log('onboardingToken ',onboardingToken);
    const email = onboardingToken.email;
    let roles = onboardingToken.roles;
    let superAdmin = false;
    if(roles[0] == 'superadmin'){
        superAdmin = true;
        roles = [];
    }

    const companyExists = await Company.findOne({ companyEmail: companyData.companyEmail });
    if (companyExists) {
        throw new Error('Company with this email already exists.');
    }

    const newCompany = await Company.create(companyData);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const newUser = await User.create({
        companyId: newCompany._id,
        name: userData.name,
        email: email,
        passwordHash,
        role: roles,
        isSuperAdmin: superAdmin
    });
    await OnboardingToken.findByIdAndDelete(onboardingToken._id);

    const payload = {
            userId: newUser._id,
            companyId: newUser.companyId,
            role: newUser.role,
            isSuperAdmin: newUser.isSuperAdmin
        };
    
    const authToken = jwt.sign(payload, process.env.JWT, { expiresIn: '24h' });

    const response = { 
        token : authToken ,
        user : {
            "name": newUser.name,
            "email": newUser.email,
            "role": newUser.role,   
            "isSuperAdmin": newUser.isSuperAdmin,
        }, 
        company : {
            "companyName": newCompany.companyName,
            "companyEmail": newCompany.companyEmail,
            "currency": newCompany.currency,
            "timezone" : newCompany.timezone,
            "logoUrl" : newCompany.logoUrl,
            "alertSettings": newCompany.alertSettings,
        } 
    };

    await redisClient.setEx(`auth:${newUser._id}`,86400,JSON.stringify(response));

    return response;
};
