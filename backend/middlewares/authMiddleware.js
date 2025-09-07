const usersModel = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { valid: false, expired: true, decoded: null };
    } else {
      return { valid: false, expired: false, decoded: null };
    }
  }
}

const checkAdmin = (allowedRoles) => async (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message : 'Unauthorized token' });
    }
   const result = verifyToken(token);
    if (!result.valid) {
        if (result.expired) {
            return res.status(401).json({ message: 'Token expired' });
        } else {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        const decoded = result.decoded;
        const user = await redisClient.get(`auth:${decoded.userId}`);

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. No user found.' });
        }
        
        if(decoded.isSuperAdmin){
            req.user = JSON.parse(user);
            return next();
        }   

        const userRoles = req.user.role;
        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

        if (hasRequiredRole) {
            req.user = JSON.parse(user);
            return next();
        }
        return res.status(403).json({ message: 'Forbidden. You do not have the required permissions.' });
    }

    
    // try{
    //     const user = await usersModel.findById(decoded.userId);
    //     req.user = user;
    //     console.log('user1',user);
    //     await redisClient.setEx(`auth:${user._id}`,86400,JSON.stringify(user));
    //     return next();
    // } catch(err){
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }
}


// const checkRoles = (allowedRoles) => (req, res, next) => {
//     if (!req.user) {
//         return res.status(401).json({ message: 'Authentication failed. No user found.' });
//     }
//     if (req.user.isSuperAdmin) {
//         return next();
//     }
//     const userRoles = req.user.role;
//     console.log('req.user',req.user);
//     console.log('allowedRoles',allowedRoles);
//     const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

//     if (hasRequiredRole) {
//         return next();
//     }
//     return res.status(403).json({ message: 'Forbidden. You do not have the required permissions.' });
// };

 module.exports = { checkAdmin };
// module.exports.checkSuperAdmin = async (req,res,next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if(!token){
//         return res.status(401).json({ message : 'Unauthorized token' });
//     }
//     const decoded = jwt.verify(token,process.env.JWT);

//     if (decoded.isSuperAdmin) {
//         return next();
//     }
// }