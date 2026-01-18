const { validationResult } = require('express-validator');
const productionJobService = require('../services/productionJobService');
const templateWorker = require('../worker/templateWorker');
const emailWorker = require('../services/emailWorker');
const emailSettingsService = require('../services/emailSettingsService');

module.exports.getProductionJob = async (req, res) => {
    try {
        const job = await productionJobService.getProductionJobById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Production job not found.' });
        return res.status(200).json({ job });
    } catch (err) {
        console.error('Error fetching production job by ID:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.getAllProductionJobs = async (req, res) => {
    try {
        const jobs = await productionJobService.getAllProductionJobs(req.user.company.companyId);
        return res.status(200).json({ jobs });
    } catch (err) {
        console.error('Error fetching production jobs:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.createProductionJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { jobId, quoteId, orderId, jobDetails, productionStatus, productionStartDate, productionDeadline } = req.body;
        const doc = await productionJobService.createProductionJob({
            companyId: req.user.company.companyId,
            userId: req.user.user.userId,
            jobId,
            quoteId,
            orderId,
            jobDetails,
            productionStatus,
            productionStartDate,
            productionDeadline
        });
        return res.status(201).json({ productionJob: doc });
    } catch (err) {
        console.error('Error creating production job:', err);
        return res.status(400).json({ message: err.message });
    }
};

module.exports.updateProductionJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        // Only allow updating productionStatus and productionDeadline
        const { productionStatus, productionDeadline } = req.body;
        const updateData = {};
        if (productionStatus !== undefined) {
            updateData.productionStatus = productionStatus;
        }
        if (productionDeadline !== undefined) {
            updateData.productionDeadline = productionDeadline;
        }
        const updated = await productionJobService.updateProductionJob(req.params.id, updateData);
        if (!updated) return res.status(404).json({ message: 'Production job not found.' });

        // If productionStatus is being updated, update status in job model as well
        if (productionStatus !== undefined) {
            const jobService = require('../services/jobService');
            // Map productionStatus to job status
            let jobStatus;
            switch (productionStatus) {
                case 'Not Started':
                    jobStatus = 'Pending';
                    break;
                case 'In Progress':
                    jobStatus = 'In Production';
                    break;
                case 'Completed':
                    jobStatus = 'Completed';
                    break;
                case 'Paused':
                    jobStatus = 'On Hold';
                    break;
                default:
                    jobStatus = undefined;
            }
            if (jobStatus) {
                await jobService.updateJob(updated.jobId, { status: jobStatus });
            }
        }
        return res.status(200).json({ productionJob: updated });
    } catch (err) {
        console.error('Error updating production job:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.deleteProductionJob = async (req, res) => {
    try {
        const deleted = await productionJobService.deleteProductionJob(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Production job not found.' });
        return res.status(200).json({ message: 'Production job deleted successfully.' });
    } catch (err) {
        console.error('Error deleting production job:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.updateJobDetailStatus = async (req, res) => {
    const { productionJobId } = req.params;
    const { lineItemId, status, completed, priority } = req.body;
    try {
        const jobDetails = await productionJobService.updateJobDetailStatus(productionJobId, { lineItemId, status, completed, priority });

        // Send production update email (if enabled)
        const emailEnabled = await emailSettingsService.isEmailEnabled(req.user.company.companyId, 'productionUpdate');
        if (emailEnabled && req.user.email) {
            // Get job name for email
            const productionJob = await productionJobService.getProductionJobById(productionJobId);
            const jobName = productionJob?.jobDetails?.type || 'Production Job';
            sendProductionJobUpdateEmail(jobName, `Status updated to: ${status}`, req.user.email);
        }

        return res.status(200).json({ jobDetails });
    } catch (err) {
        console.error('Error updating job detail status:', err);
        if (err.message === 'Production job not found.' || err.message === 'Job detail not found.') {
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Example: Send production job update email
async function sendProductionJobUpdateEmail(jobName, updateDetails, toEmail) {
    const html = templateWorker.getTemplate('productionJobUpdate', { jobName, updateDetails });
    await emailWorker.sendEmail({
        from: 'Yooqly <no-reply@yooqly.com>',
        to: toEmail,
        subject: 'Production Job Update: ' + jobName,
        html
    });
}
