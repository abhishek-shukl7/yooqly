const jobModel = require('../models/jobModel');
 const counters = require('../models/counterModel');

module.exports.createJob = async ({ companyId,customerId,quantity,userId ,type,subType,jobDetails,deadline,status,priority,requirements,comments,estimatedCost}) => {
    if(!userId || !quantity|| !requirements || !type || !subType || !jobDetails || !customerId || !deadline || !userId || !companyId || !status || !priority || !estimatedCost || !comments){
        throw new Error('Required fields are missing.');
    }

    try {
        const orderId = await generateNextOrderId();
        const job = await jobModel.create({ companyId,customerId,quantity,userId,orderId ,type,subType,jobDetails,deadline,status,priority,requirements,comments,estimatedCost});
        
        return job;
    } catch (err) {
        throw new Error('Error saving job to database.',err);
    }
}


module.exports.getAllJobs= async (companyId) => {
    return await jobModel.find({companyId: companyId}).populate('customerId', 'customerName customerCompanyName');
};

module.exports.getProductionJobs= async (companyId) => {
    return await jobModel.find({companyId: companyId,status: 'production'}).populate('customerId', 'customerName customerCompanyName');
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