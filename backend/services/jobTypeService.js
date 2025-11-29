const jobTypeModel = require('../models/jobTypeModel');

module.exports.getAllJobTypes= async () => {
    return await jobTypeModel.find();
};
