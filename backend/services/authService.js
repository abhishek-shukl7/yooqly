const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const Company = require('../models/companyModel');
const redisClient = require("../config/redis");

module.exports.login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password.');
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid email or password.');
    }

    const payload = {
        userId: user._id,
        companyId: user.companyId,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin
    };

    const token = jwt.sign(payload, process.env.JWT, { expiresIn: '24h' });

    const company = await Company.findOne({ _id: user.companyId });
    if (!company) {
        throw new Error('Company not found.');
    }
    console.log("company details",company);

    const response = { 
        token : token ,
        user : {
            "name": user.name,
            "email": user.email,
            "role": user.role,   
            "isSuperAdmin": user.isSuperAdmin,
            "userId": user._id
        }, 
        company : {
            "companyName": company.companyName,
            "companyEmail": company.companyEmail,
            "currency": company.currency,
            "timezone" : company.timezone,
            "logoUrl" : company.logoUrl,
            "alertSettings": company.alertSettings,
            "companyId": company._id
        } 
    };

    await redisClient.setEx(`auth:${user._id}`,86400,JSON.stringify(response));
    
    console.log('User from Redis:', await redisClient.get(`auth:${user._id}`));
    return response;
};
