const productionJobModel = require('../models/productionJobModel');

module.exports.createProductionJob = async ({ companyId, jobId, quoteId, userId, jobDetails, productionStatus, productionStartDate, productionEndDate }) => {
    if(!companyId || !jobId || !userId){
        throw new Error('Required fields are missing.');
    }

    try {
        const doc = await productionJobModel.create({ companyId, jobId, quoteId, userId, jobDetails, productionStatus, productionStartDate, productionEndDate });
        return doc;
    } catch (err) {
        console.error(err);
        throw new Error('Error saving production job to database.');
    }
}

module.exports.getAllProductionJobs = async (companyId) => {
    return await productionJobModel.find({ companyId }).populate('jobId').populate('quoteId').populate('userId');
};

module.exports.getProductionJobById = async (id) => {
    return await productionJobModel.findById(id).populate('jobId').populate('quoteId').populate('userId');
};

module.exports.updateProductionJob = async (id, updateData) => {
    return await productionJobModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

module.exports.deleteProductionJob = async (id) => {
    return await productionJobModel.findByIdAndDelete(id);
};
