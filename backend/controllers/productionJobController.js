const { validationResult } = require('express-validator');
const productionJobService = require('../services/productionJobService');
const templateWorker = require('../worker/templateWorker');
const emailWorker = require('../services/emailWorker');
const emailSettingsService = require('../services/emailSettingsService');
const customerService = require('../services/customerService');

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
        if (emailEnabled) {
            // Get job name and customer email
            const productionJob = await productionJobService.getProductionJobById(productionJobId);

            if (productionJob) {
                const customer = await customerService.getCustomerById(productionJob.customerId);

                if (customer && customer.customerEmail) {
                    const detail = productionJob.jobDetails.find(d => d.lineItemId === lineItemId);
                    const jobName = detail ? (detail.type || 'Production Job') : 'Production Job';

                    const emailData = {
                        lineItemId: detail.lineItemId,
                        status: status,
                        completed: completed !== undefined ? completed : detail.completed,
                        quantity: detail.fields?.Quantity || detail.fields?.quantity || 'N/A',
                        deadline: productionJob.productionDeadline
                    };

                    sendProductionJobUpdateEmail(jobName, productionJob.orderId, `Status updated to: ${status}`, customer.customerEmail, emailData);
                }
            }
        }

        // Check if all items are completed
        // Fetch job again to be sure we have latest status (it was fetched above inside if (emailEnabled), but scope issues)
        // Better to lift productionJob fetch out if possible, but let's just use what we have or refetch if needed.
        // Actually, let's just refetch to be clean and safe, or check if we can reuse.
        // To avoid code duplication, I'll refetch/use cleanly.

        const productionJobForCheck = await productionJobService.getProductionJobById(productionJobId);
        if (productionJobForCheck) {
            const allCompleted = productionJobForCheck.jobDetails.every(d => (d.status || '').toLowerCase() === 'completed');

            // If all completed AND main status is not yet 'Completed'
            if (allCompleted && productionJobForCheck.productionStatus !== 'Completed') {
                const completedEmailEnabled = await emailSettingsService.isEmailEnabled(req.user.company.companyId, 'productionCompleted');

                if (completedEmailEnabled) {
                    const customer = await customerService.getCustomerById(productionJobForCheck.customerId);
                    if (customer && customer.customerEmail) {
                        sendProductionCompletedEmail(
                            productionJobForCheck.orderId,
                            productionJobForCheck.jobDetails,
                            customer.customerEmail,
                            customer.customerName || customer.firstName
                        );

                        // Update Main Status to Completed
                        // Use updateProductionJob service or direct model update?
                        // Let's use service if possible, or just update doc.
                        await productionJobService.updateProductionJob(productionJobId, { productionStatus: 'Completed' });

                        // Also update main JOB status? logic exists in updateProductionJob controller but not service?
                        // To be enabling, I should call the controller logic or replicate it.
                        // Simpler: Just update production job status for now.
                        // If I want to trigger the side-effects of main job update, calling controller function directly is messy.
                        // I'll leave the main main Job status (Order status) alone for now unless requested,
                        // but I WILL update productionJob.productionStatus.
                    }
                }
            }
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
async function sendProductionJobUpdateEmail(jobName, orderId, updateDetails, toEmail, additionalData = {}) {
    const html = templateWorker.getTemplate('productionJobUpdate', { jobName, updateDetails, ...additionalData });
    await emailWorker.sendEmail({
        from: 'testclient@hackersdaddy.com',
        to: toEmail,
        subject: `Production Job Update - Order #${orderId}`,
        html
    });
}

async function sendProductionCompletedEmail(orderId, items, toEmail, customerName) {
    const html = templateWorker.getTemplate('productionCompleted', { orderId, items, customerName });
    await emailWorker.sendEmail({
        from: 'testclient@hackersdaddy.com',
        to: toEmail,
        subject: `Production Completed - Order #${orderId}`,
        html
    });
}
