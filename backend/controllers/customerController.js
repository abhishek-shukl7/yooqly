const { validationResult } = require("express-validator");
const customerModel = require("../models/customersModel");
const customerService = require("../services/customerService");

module.exports.getCustomer = async (req,res,next) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'customer not found.' });
        }
        return res.status(200).json({ customer });
    } catch (err) {
        console.error('Error fetching customer by ID:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.createCustomer = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    const { customerEmail, customerName , customerCompanyName, phone, address } = req.body;

    const customerExists = await customerService.findCustomerByEmail({ customerEmail });

    if(customerExists){
        return res.status(400).json({ message : 'customer already exists.'});
    }
    
    const customer = await customerService.createCustomer({
        customerEmail : customerEmail,
        customerName : customerName,
        customerCompanyName: customerCompanyName,
        phone: phone,
        address: address,
        companyId: req.user.company.companyId
    });

    return res.status(200).json({customer: customer});
}


module.exports.updateCustomer = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    try {
        const updatedCustomer = await customerService.updateCustomer(req.params.id, req.body);
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'customer not found.' });
        }
        return res.status(200).json({ customer: updatedCustomer });
    } catch (err) {
        console.error('Error updating customer:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers(req.user.company.companyId);
        return res.status(200).json({ customers });
    } catch (err) {
        console.error('Error fetching all customers:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await CustomerService.deleteCustomer(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'customer not found.' });
        }
        return res.status(200).json({ message: 'customer deleted successfully.' });
    } catch (err) {
        console.error('Error deleting customer:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};