const { validationResult } = require('express-validator');
const productionJobService = require('../services/productionJobService');

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
        const updated = await productionJobService.updateProductionJob(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Production job not found.' });
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
        return res.status(200).json({ jobDetails });
    } catch (err) {
        console.error('Error updating job detail status:', err);
        if (err.message === 'Production job not found.' || err.message === 'Job detail not found.') {
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
