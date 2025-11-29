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