const quoteModel = require('../models/quoteModel');
const jobModel = require('../models/jobModel');
const jobTypeModel = require('../models/jobTypeModel');
const productionJobService = require('./productionJobService');

module.exports.createQuote = async ({ companyId,userId,customerId,jobId,orderId,tax,terms,requirements,quoteTotal,quoteItems,quoteDeadline }) => {
    if(!customerId || !jobId || !orderId || !tax || !quoteTotal || !quoteItems || !quoteDeadline){
        throw new Error('Required fields are missing.');
    }

    try {

        let quoteItem = await validateJobDetails(quoteItems, jobTypeModel);

        const quote = await quoteModel.create({ companyId,userId,customerId,jobId,orderId,tax,terms,requirements,quoteTotal,quoteItems: quoteItem,quoteDeadline });
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
                customerId: quoteStatus.customerId,
                quoteId: quoteStatus._id,
                userId: quoteStatus.userId,
                orderId: quoteStatus.orderId,
                jobDetails: job.jobDetails.map((detail, idx) => {
                    return {
                        ...detail.toObject(),
                        status: job.status || 'Pending',
                        priority: job.priority || 'Medium',
                        completed: 0,
                        lineItemId: `LP-${(idx+1).toString().padStart(3, '0')}`
                    };
                }),
                productionStatus: 'Not Started',
                productionStartDate: new Date(),
                productionDeadline: null
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

async function validateJobDetails(userJobDetails, jobTypeSchema) {

    if (!Array.isArray(userJobDetails) || userJobDetails.length === 0) {
        throw new Error('Job details must be provided as a non-empty array.');
    }

    const validDetails = [];
    const mainFields = jobTypeSchema.fields || [];

    for (const detail of userJobDetails) {
        if (!detail.itemName || !detail.fields) {
            throw new Error('Each job detail item must have a "type" and a "fields" object.');
        }

        const jobTypeDocument = await jobTypeSchema.findOne({ name: detail.itemName }).lean();

        if (!jobTypeDocument) {
            throw new Error(`Invalid job type: ${detail.itemName}.`);
        }
        const subTypeMatch = jobTypeDocument.type.find(t => t.name === detail.subType);
        
        if (!subTypeMatch) {
            throw new Error(`Invalid job sub-type: ${detail.itemName} for main type ${jobTypeSchema.name}.`);
        }

        let allRequiredFields = [...jobTypeDocument.fields];
        if (subTypeMatch.fields) {
            allRequiredFields.push(...subTypeMatch.fields);
        }
        

        for (const fieldSchema of allRequiredFields) {
            const fieldName = fieldSchema.name;
            const userValue = detail.fields[fieldName];

            if (fieldSchema.required && (userValue === undefined || userValue === null || userValue === '')) {
                throw new Error(`Missing required field: '${fieldName}' for job type '${detail.itemName}'.`);
            }

            if (userValue && fieldSchema.values.length > 0) {
                if (!fieldSchema.values.includes(userValue)) {
                    throw new Error(`Invalid value '${userValue}' for field '${fieldName}' in job type '${detail.itemName}'. Must be one of: ${fieldSchema.values.join(', ')}.`);
                }
            }
        }
        
        validDetails.push({
            itemName: detail.itemName,
            subType: detail.subType, 
            fields: detail.fields,
            unitPrice: detail.unitPrice,
            totalPrice: detail.totalPrice
        });
    }

    return validDetails;
}