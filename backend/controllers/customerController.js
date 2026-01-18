const { validationResult } = require("express-validator");
const customerModel = require("../models/customersModel");
const customerService = require("../services/customerService");
const templateWorker = require('../worker/templateWorker');
const emailWorker = require('../services/emailWorker');
const emailSettingsService = require('../services/emailSettingsService');
const jobService = require('../services/jobService');

module.exports.getCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'customer not found.' });
        }
        const jobCount = await jobService.getJobCountByCustomerId(req.params.id);
        return res.status(200).json({ customer, jobCount: jobCount });
    } catch (err) {
        console.error('Error fetching customer by ID:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.createCustomer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log("create customer req user:", req.user);
    console.log("create customer req body:", req.body);

    const { customerEmail, customerName, customerCompanyName, phone, address } = req.body;
    const companyId = req.user.company.companyId;

    const customerExists = await customerService.findCustomerByEmail({ customerEmail });

    if (customerExists) {
        return res.status(400).json({ message: 'customer already exists.' });
    }

    const customer = await customerService.createCustomer({
        customerEmail: customerEmail,
        customerName: customerName,
        customerCompanyName: customerCompanyName,
        phone: phone,
        address: address,
        companyId: companyId
    });

    // Send welcome email (if enabled)
    const emailEnabled = await emailSettingsService.isEmailEnabled(companyId, 'customerWelcome');
    if (emailEnabled && customerEmail) {
        sendCustomerWelcomeEmail(customerName, req.user.company.companyName, customerEmail);
    }

    return res.status(200).json({ customer: customer });
}


module.exports.updateCustomer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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

        // Add job_count for each customer
        const customersWithJobCount = await Promise.all(
            customers.map(async (customer) => {
                const jobCount = await jobService.getJobCountByCustomerId(customer._id);
                return {
                    ...customer.toObject(),
                    job_count: jobCount
                };
            })
        );

        return res.status(200).json({ customers: customersWithJobCount });
    } catch (err) {
        console.error('Error fetching all customers:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await customerService.deleteCustomer(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'customer not found.' });
        }
        return res.status(200).json({ message: 'customer deleted successfully.' });
    } catch (err) {
        console.error('Error deleting customer:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Example: Send welcome email when customer joins
async function sendCustomerWelcomeEmail(customerName, companyName, toEmail) {
    const html = templateWorker.getTemplate('customerJoined', { customerName, companyName });
    await emailWorker.sendEmail({
        from: 'testclient@hackersdaddy.com',
        to: toEmail,
        subject: 'Welcome to ' + companyName,
        html
    });
}