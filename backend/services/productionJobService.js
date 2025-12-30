const productionJobModel = require('../models/productionJobModel');

module.exports.createProductionJob = async ({ companyId, customerId, jobId, quoteId, userId, orderId, jobDetails, productionStatus, productionStartDate, productionDeadline }) => {
    if(!companyId || !jobId || !userId || !customerId){
        throw new Error('Required fields are missing.');
    }

    try {
        const doc = await productionJobModel.create({ companyId, customerId, jobId, quoteId, userId, orderId, jobDetails, productionStatus, productionStartDate, productionDeadline });
        return doc;
    } catch (err) {
        console.error(err);
        throw new Error('Error saving production job to database.');
    }
}

module.exports.getAllProductionJobs = async (companyId) => {
    return await productionJobModel.find({ companyId }).populate('customerId', 'customerName customerCompanyName');
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

module.exports.updateJobDetailStatus = async (productionJobId, { lineItemId, status, completed, priority }) => {
    const productionJob = await productionJobModel.findById(productionJobId);
    if (!productionJob) throw new Error('Production job not found.');
    const detail = productionJob.jobDetails.find(jd => jd.lineItemId === lineItemId);
    if (!detail) throw new Error('Job detail not found.');
    if (status) detail.status = status;
    if (completed !== undefined) detail.completed = completed;
    if (priority) detail.priority = priority;
    await productionJob.save();
    return productionJob.jobDetails;
};
