const customerModel = require('../models/customersModel');

module.exports.createCustomer = async ({ customerEmail, customerName , customerCompanyName, phone, address,companyId } ) => {
    if(!customerEmail || !customerName || !customerCompanyName || !companyId || !phone || !address){
        throw new Error('Required fields are missing.');
    }

    try {
        const customer = await customerModel.create({ customerEmail, customerName , customerCompanyName, phone, address,companyId });
        return customer;
    } catch (err) {
        throw new Error('Error saving customer to database.');
    }
}

module.exports.findCustomerByEmail = async (email) => {
    return await customerModel.findOne({ email });
};

module.exports.getAllCustomers= async (companyId) => {
    return await customerModel.find({companyId: companyId});
};

module.exports.getCustomerById = async (id) => {
    return await customerModel.findById(id);
};

module.exports.updateCustomer = async (id, updateData) => {
    return await customerModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

module.exports.deleteCustomer = async (id) => {
    return await customerModel.findByIdAndDelete(id);
};
