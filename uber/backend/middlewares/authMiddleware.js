const userModel = require("../models/userModel");
const driverModel = require("../models/driverModel");
const blackListtokenModel = require("../models/tokenModel");
const jwt = require("jsonwebtoken");

module.exports.checkUser = async (req,res,next) => {
    // const token = req.cookes.token || req.headers.authorization.split(' ')[1];
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({ message : 'Unauthorized token' });
    }

    const isblackListed = await blackListtokenModel.findOne({ token : token});
    if(isblackListed){
        return res.status(401).json({ message : 'Unauthorized' });
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT);
        const user = await userModel.findById(decoded._id);
        req.user = user;

        return next();

    } catch(err){
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.checkDriver = async (req,res,next) => {
    // const token = req.cookes.token || req.headers.authorization.split(' ')[1];
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({ message : 'Unauthorized token' });
    }

    const isblackListed = await blackListtokenModel.findOne({ token : token});
    if(isblackListed){
        return res.status(401).json({ message : 'Unauthorized' });
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT);
        const driver = await driverModel.findById(decoded._id);
        req.driver = driver;

        return next();

    } catch(err){
        return res.status(401).json({ message: 'Unauthorized' });
    }
}