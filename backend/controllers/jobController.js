const { validationResult } = require("express-validator");
const jobService = require("../services/jobService");
const customerService = require("../services/customerService");
const templateWorker = require('../worker/templateWorker');
const emailWorker = require('../services/emailWorker');
const emailSettingsService = require('../services/emailSettingsService');

module.exports.getJob = async (req, res, next) => {
    try {
        const job = await jobService.getJobById(req.params.id);
        const customer = await customerService.getCustomerById(job.customerId);
        if (!job || !customer) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        const response = {
            job: job,
            customer: customer
        }
        return res.status(200).json({ response });
    } catch (err) {
        console.error('Error fetching job by ID:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.createJob = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { customerId, quantity, jobDetails, deadline, estimatedCost, priority, requirements, comments, status } = req.body;
    const companyId = req.user.company.companyId;

    const job = await jobService.createJob({
        companyId: companyId,
        customerId: customerId,
        quantity: quantity,
        userId: req.user.user.userId,
        jobDetails: jobDetails,
        deadline: deadline,
        status: status,
        priority: priority,
        requirements: requirements,
        comments: comments,
        estimatedCost: estimatedCost
    });

    // Send job created email to customer (if enabled)
    const customer = await customerService.getCustomerById(customerId);
    if (customer && customer.customerEmail) {
        const emailEnabled = await emailSettingsService.isEmailEnabled(companyId, 'jobCreated');
        if (emailEnabled) {
            sendJobCreatedEmail(job, customer, customer.customerEmail);
        }
    }

    return res.status(200).json({ job: job });
}

async function sendJobCreatedEmail(job, customer, toEmail) {
    // Generate readable job type for subject line
    const jobTypes = (job.jobDetails || []).map(item => item.type).filter(Boolean);
    const subjectJobType = jobTypes.length > 0 ? jobTypes.join(', ') : 'New Job';

    const html = templateWorker.getTemplate('jobCreated', { job, customer });
    await emailWorker.sendEmail({
        from: 'testclient@hackersdaddy.com',
        to: toEmail,
        subject: `New Job Created: ${subjectJobType} - Order #${job.orderId || 'N/A'}`,
        html
    });
}

module.exports.updateJob = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedJob = await jobService.updateJob(req.params.id, req.body);
        if (!updatedJob) {
            return res.status(404).json({ message: 'job not found.' });
        }
        return res.status(200).json({ job: updatedJob });
    } catch (err) {
        console.error('Error updating job:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs(req.user.company.companyId);
        return res.status(200).json({ jobs });
    } catch (err) {
        console.error('Error fetching all orders:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.getProductionJobs = async (req, res) => {
    try {
        const jobs = await jobService.getProductionJobs(req.user.company.companyId);
        return res.status(200).json({ jobs });
    } catch (err) {
        console.error('Error fetching all orders:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports.deleteJob = async (req, res) => {
    try {
        const deletedJob = await JobService.deleteJob(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'job not found.' });
        }
        return res.status(200).json({ message: 'job deleted successfully.' });
    } catch (err) {
        console.error('Error deleting job:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

