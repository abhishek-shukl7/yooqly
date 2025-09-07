const quoteModel = require('../models/quoteModel');

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
    return await quoteModel.find({companyId:companyId});
};

module.exports.getQuoteById = async (id) => {
    return await quoteModel.findById(id);
};


module.exports.quoteApproval = async (id) => {
    return await quoteModel.findByIdAndUpdate(id, {status:'approved'}, { new: true, runValidators: true });
};

module.exports.updateQuote = async (id, updateData) => {
    return await quoteModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

// module.exports.deleteQuote = async (id) => {
//     return await quoteModel.findByIdAndDelete(id);
// };
