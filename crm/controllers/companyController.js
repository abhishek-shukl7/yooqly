const { validationResult } = require("express-validator");
const companyModel = require("../models/companyModel");
const companyService = require("../services/companyService");

module.exports.getCompany = async (req,res,next) => {
    try {
        const company = await companyService.getCompanyById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }
        return res.status(200).json({ company });
    } catch (err) {
        console.error('Error fetching company by ID:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.createCompany = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    const { companyEmail, companyName , currency , logoUrl,timezone,alertSettings} = req.body;
    const companyExists = await companyService.findCompanyByEmail({ companyEmail });

    if(companyExists){
        return res.status(400).json({ message : 'Company already exists.'});
    }
    const company = await companyService.createCompany({
        companyEmail : companyEmail,
        companyName : companyName,
        currency: currency,
        logoUrl: logoUrl,
        timezone: timezone,
        alertSettings: alertSettings
    });

    return res.status(200).json({company: company});
}


module.exports.updateCompany = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    try {
        const updatedCompany = await companyService.updateCompany(req.params.id, req.body);
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found.' });
        }
        return res.status(200).json({ company: updatedCompany });
    } catch (err) {
        console.error('Error updating company:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await companyService.getAllCompanies();
        return res.status(200).json({ companies });
    } catch (err) {
        console.error('Error fetching all companies:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports.deleteCompany = async (req, res) => {
    try {
        const deletedCompany = await companyService.deleteCompany(req.params.id);
        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found.' });
        }
        return res.status(200).json({ message: 'Company deleted successfully.' });
    } catch (err) {
        console.error('Error deleting company:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};