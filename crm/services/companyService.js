const companyModel = require('../models/companyModel');

module.exports.createCompany = async ({ companyData }) => {
    if(!companyData.companyEmail || !companyData.companyName || !companyData.currency){
        throw new Error('Required fields are missing.');
    }

    try {
        const company = await companyModel.create(companyData);
        return company;
    } catch (err) {
        throw new Error('Error saving company to database.');
    }
}

module.exports.findCompanyByEmail = async (companyEmail) => {
    return await companyModel.findOne({ companyEmail });
};

module.exports.getAllCompanies = async () => {
    return await companyModel.find();
};

module.exports.getCompanyById = async (id) => {
    return await companyModel.findById(id);
};

module.exports.updateCompany = async (id, updateData) => {
    return await companyModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

module.exports.deleteCompany = async (id) => {
    return await companyModel.findByIdAndDelete(id);
};
