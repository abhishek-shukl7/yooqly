const invoiceModel = require('../models/invoiceModel');

module.exports.createInvoice = async ({ invoiceData }) => {
    if(!invoiceData.dueDate || !invoiceData.status || !invoiceData.invoiceTotal || !invoiceData.customerId || !invoiceData.quoteId || !invoiceData.userId || !invoiceData.invoiceDate || !invoiceData.companyId){
        throw new Error('Required fields are missing.');
    }

    try {
        const invoice = await invoiceModel.create(invoiceData);
        return invoice;
    } catch (err) {
        throw new Error('Error saving invoice to database.');
    }
}


module.exports.getAllInvoices= async () => {
    return await invoiceModel.find();
};

module.exports.getInvoiceById = async (id) => {
    return await invoiceModel.findById(id);
};

module.exports.updateInvoice = async (id, updateData) => {
    return await invoiceModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

// module.exports.deleteInvoice = async (id) => {
//     return await invoiceModel.findByIdAndDelete(id);
// };
