const usersModel = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const Company = require('../models/companyModel');

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

const checkAdmin = (allowedRoles) => async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized token' });
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
    let user = await redisClient.get(`auth:${decoded.userId}`);

    if (!user) {
      // Fallback to MongoDB
      try {
        const dbUser = await usersModel.findById(decoded.userId);
        if (!dbUser) {
          return res.status(401).json({ message: 'Authentication failed. No user found.' });
        }
        const company = await Company.findById(dbUser.companyId);

        const response = {
          token: token,
          user: {
            "name": dbUser.name,
            "email": dbUser.email,
            "role": dbUser.role,
            "isSuperAdmin": dbUser.isSuperAdmin,
            "userId": dbUser._id
          },
          company: company ? {
            "companyName": company.companyName,
            "companyEmail": company.companyEmail,
            "currency": company.currency,
            "timezone": company.timezone,
            "logoUrl": company.logoUrl,
            "alertSettings": company.alertSettings,
            "companyId": company._id
          } : {}
        };

        user = JSON.stringify(response);
        await redisClient.setEx(`auth:${dbUser._id}`, 86400, user);

      } catch (err) {
        console.error('Auth Middleware Error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }

    const userData = JSON.parse(user);

    if (decoded.isSuperAdmin) {
      req.user = userData;
      return next();
    }

    // Fix: Access role from the correct location in the structure
    const userRoles = userData.user.role;
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

    if (hasRequiredRole) {
      req.user = userData;
      return next();
    }
    return res.status(403).json({ message: 'Forbidden. You do not have the required permissions.' });
  }
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