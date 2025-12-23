const quoteModel = require('../models/quoteModel');
const jobModel = require('../models/jobModel');
const productionJobService = require('./productionJobService');

module.exports.createQuote = async ({ companyId,userId,customerId,jobId,orderId,tax,terms,requirements,quoteTotal,quoteItems,quoteDeadline }) => {
    if(!customerId || !jobId || !orderId || !tax || !quoteTotal || !quoteItems || !quoteDeadline){
        throw new Error('Required fields are missing.');
    }

    try {
        const quote = await quoteModel.create({ companyId,userId,customerId,jobId,orderId,tax,terms,requirements,quoteTotal,quoteItems,quoteDeadline });
        return quote;
    } catch (err) {
        console.log(err);
        throw new Error('Error saving quote to database.');
    }
}


module.exports.getAllQuotes= async (companyId) => {
    return await quoteModel.find({companyId:companyId}).populate('customerId', 'customerName customerCompanyName');
};

module.exports.getQuoteById = async (id) => {
    return await quoteModel.findById(id).populate('customerId', 'customerName customerCompanyName');
};


module.exports.quoteApproval = async (id,status) => {
    if (!['approved', 'rejected'].includes(status)) {
        throw new Error('Invalid status value.');
    }
    let quoteStatus =  await quoteModel.findByIdAndUpdate(id, {status}, { new: true, runValidators: true });
    // If approved, create production job
    if (status === 'approved' && quoteStatus) {
        // Fetch job data
        const job = await jobModel.findById(quoteStatus.jobId);
        if (job) {
            await productionJobService.createProductionJob({
                companyId: quoteStatus.companyId,
                jobId: quoteStatus.jobId,
                quoteId: quoteStatus._id,
                userId: quoteStatus.userId,
                jobDetails: job.jobDetails.map(detail => ({
                    ...detail.toObject(),
                    status: job.status || 'Pending'
                })),
                productionStatus: 'Not Started',
                productionStartDate: new Date(),
                productionEndDate: null
            });
        }
    }
    return quoteStatus;
};

module.exports.updateQuote = async (id, updateData) => {
    return await quoteModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

// module.exports.deleteQuote = async (id) => {
//     return await quoteModel.findByIdAndDelete(id);
// };
