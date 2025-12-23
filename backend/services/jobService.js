const jobModel = require('../models/jobModel');
const jobTypeModel = require('../models/jobTypeModel');
 const counters = require('../models/counterModel');
 const mongoose = require('mongoose');

module.exports.createJob = async ({ companyId,customerId,quantity,userId ,jobDetails,deadline,status,priority,requirements,comments,estimatedCost}) => {
    if(!userId || !quantity|| !requirements || !jobDetails || !customerId || !deadline || !userId || !companyId || !status || !priority || !estimatedCost || !comments){
        throw new Error('Required fields are missing.');
    }

    try {

        jobDetails = await validateJobDetails(jobDetails, jobTypeModel);
        console.log("Validated job details:", jobDetails);
        const orderId = await generateNextOrderId();
        const job = await jobModel.create({ companyId,customerId,quantity,userId,orderId ,jobDetails,deadline,status,priority,requirements,comments,estimatedCost});

        return job;
    } catch (err) {
        throw new Error('Error saving job to database.',err);
    }
}


module.exports.getAllJobs= async (companyId) => {
    return await jobModel.find({companyId: companyId}).populate('customerId', 'customerName customerCompanyName');
};

module.exports.getProductionJobs= async (companyId) => {
    const companyIdNew = new mongoose.Types.ObjectId(companyId);
    return await jobModel.find({companyId: companyIdNew,status: 'production'}).populate('customerId', 'customerName customerCompanyName');
};

module.exports.getJobById = async (id) => {
    return await jobModel.findById(id).populate('customerId', 'customerName customerCompanyName');
};

module.exports.updateJob = async (id, updateData) => {
    return await jobModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

// module.exports.deleteJob = async (id) => {
//     return await jobModel.findByIdAndDelete(id);
// };

async function generateNextOrderId() {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    const result = await counters.findOneAndUpdate(
      { _id: dateString },
      { $inc: { sequence_value: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
    const sequenceNumber = result.sequence_value;
    const formattedSequence = String(sequenceNumber).padStart(5, '0');
    
    const orderId = `${dateString}${formattedSequence}`;
    return orderId;
  } catch (err) {
    throw new Error('Error generating order ID',err);
  }
}

async function validateJobDetails(userJobDetails, jobTypeSchema) {

    if (!Array.isArray(userJobDetails) || userJobDetails.length === 0) {
        throw new Error('Job details must be provided as a non-empty array.');
    }

    const validDetails = [];
    const mainFields = jobTypeSchema.fields || [];

    for (const detail of userJobDetails) {
        if (!detail.type || !detail.fields) {
            throw new Error('Each job detail item must have a "type" and a "fields" object.');
        }

        const jobTypeDocument = await jobTypeSchema.findOne({ name: detail.type }).lean();

        if (!jobTypeDocument) {
            throw new Error(`Invalid job type: ${detail.type}.`);
        }
        const subTypeMatch = jobTypeDocument.type.find(t => t.name === detail.subType);
        
        if (!subTypeMatch) {
            throw new Error(`Invalid job sub-type: ${detail.type} for main type ${jobTypeSchema.name}.`);
        }

        let allRequiredFields = [...jobTypeDocument.fields];
        if (subTypeMatch.fields) {
            allRequiredFields.push(...subTypeMatch.fields);
        }
        

        for (const fieldSchema of allRequiredFields) {
            const fieldName = fieldSchema.name;
            const userValue = detail.fields[fieldName];

            if (fieldSchema.required && (userValue === undefined || userValue === null || userValue === '')) {
                throw new Error(`Missing required field: '${fieldName}' for job type '${detail.type}'.`);
            }

            if (userValue && fieldSchema.values.length > 0) {
                if (!fieldSchema.values.includes(userValue)) {
                    throw new Error(`Invalid value '${userValue}' for field '${fieldName}' in job type '${detail.type}'. Must be one of: ${fieldSchema.values.join(', ')}.`);
                }
            }
        }
        
        validDetails.push({
            type: detail.type,
            subType: detail.subType, 
            fields: detail.fields,
        });
    }

    return validDetails;
}