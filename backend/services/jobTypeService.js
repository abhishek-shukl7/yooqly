const jobTypeModel = require('../models/jobTypeModel');

module.exports.getAllJobTypes= async () => {
    return await jobTypeModel.find();
};

module.exports.createJobType = async ({ name, type, fields }) => {
    console.log('Creating job type with fields:', { name, type, fields });
    const jobType = await jobTypeModel.create({ name, type, fields });
    return jobType;
}

module.exports.updateJobType = async (id, { name, type, fields }) => {
    const jobType = await jobTypeModel.findByIdAndUpdate(
        id,
        { name, type, fields },
        { new: true }
    );
    return jobType;
}

module.exports.deleteJobType = async (id) => {
    const result = await jobTypeModel.findByIdAndDelete(id);
    return result;
}
