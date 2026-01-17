const { validationResult } = require("express-validator");
// const jobTypeModel = require("../models/jobTypeModel");
const jobTypeService = require("../services/jobTypeService");

module.exports.getAllJobTypes = async (req, res) => {
    try {
        const jobs = await jobTypeService.getAllJobTypes();
        return res.status(200).json({ jobs });
    } catch (err) {
        console.error('Error fetching all orders:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create a new job type
module.exports.createJobType = async (req, res) => {
    try {
        const { name, type, fields } = req.body;
        const jobType = await jobTypeService.createJobType({ name, type, fields });
        return res.status(201).json({ jobType });
    } catch (err) {
        console.error('Error creating job type:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update a job type
module.exports.updateJobType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, fields } = req.body;
        const jobType = await jobTypeService.updateJobType(id, { name, type, fields });
        if (!jobType) {
            return res.status(404).json({ message: 'Job type not found' });
        }
        return res.status(200).json({ jobType });
    } catch (err) {
        console.error('Error updating job type:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a job type
module.exports.deleteJobType = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await jobTypeService.deleteJobType(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Job type not found' });
        }
        return res.status(200).json({ message: 'Job type deleted successfully' });
    } catch (err) {
        console.error('Error deleting job type:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
