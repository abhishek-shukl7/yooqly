const { validationResult } = require("express-validator");
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
        const { name, type, fields, customId } = req.body;
        const jobType = await jobTypeService.createJobType({ name, type, fields, customId });
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
        const { name, type, fields, customId } = req.body;
        const jobType = await jobTypeService.updateJobType(id, { name, type, fields, customId });
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

// Add a job item (subtype)
module.exports.addJobItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, customId } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Item name is required' });
        }

        const newItem = {
            name,
            customId,
            fields: []
        };

        const jobType = await jobTypeService.addJobItem(id, newItem);
        if (!jobType) {
            return res.status(404).json({ message: 'Job type not found' });
        }
        return res.status(200).json({ jobType });
    } catch (err) {
        console.error('Error adding job item:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Remove a job item (subtype)
module.exports.removeJobItem = async (req, res) => {
    try {
        const { id, itemName } = req.params;

        if (!itemName) {
            return res.status(400).json({ message: 'Item name is required' });
        }

        const jobType = await jobTypeService.removeJobItem(id, decodeURIComponent(itemName));
        if (!jobType) {
            return res.status(404).json({ message: 'Job type not found' });
        }
        return res.status(200).json({ jobType });
    } catch (err) {
        console.error('Error removing job item:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// ============ Category Field CRUD ============
module.exports.addCategoryField = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, required, values } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Field name is required' });
        }

        const result = await jobTypeService.addCategoryField(id, { name, required: !!required, values: values || [] });
        if (!result) return res.status(404).json({ message: 'Job type not found' });
        if (result.error) return res.status(400).json({ message: result.error });

        return res.status(200).json({ jobType: result });
    } catch (err) {
        console.error('Error adding category field:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.removeCategoryField = async (req, res) => {
    try {
        const { id, fieldName } = req.params;

        const jobType = await jobTypeService.removeCategoryField(id, decodeURIComponent(fieldName));
        if (!jobType) return res.status(404).json({ message: 'Job type not found' });

        return res.status(200).json({ jobType });
    } catch (err) {
        console.error('Error removing category field:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.updateCategoryField = async (req, res) => {
    try {
        const { id, fieldName } = req.params;
        const fieldData = req.body;

        const result = await jobTypeService.updateCategoryField(id, decodeURIComponent(fieldName), fieldData);
        if (!result) return res.status(404).json({ message: 'Job type not found' });
        if (result.error) return res.status(400).json({ message: result.error });

        return res.status(200).json({ jobType: result });
    } catch (err) {
        console.error('Error updating category field:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// ============ SubType Field CRUD ============
module.exports.addSubTypeField = async (req, res) => {
    try {
        const { id, subTypeName } = req.params;
        const { name, required, values } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Field name is required' });
        }

        const result = await jobTypeService.addSubTypeField(id, decodeURIComponent(subTypeName), { name, required: !!required, values: values || [] });
        if (!result) return res.status(404).json({ message: 'Job type not found' });
        if (result.error) return res.status(400).json({ message: result.error });

        return res.status(200).json({ jobType: result });
    } catch (err) {
        console.error('Error adding subtype field:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.removeSubTypeField = async (req, res) => {
    try {
        const { id, subTypeName, fieldName } = req.params;

        const result = await jobTypeService.removeSubTypeField(id, decodeURIComponent(subTypeName), decodeURIComponent(fieldName));
        if (!result) return res.status(404).json({ message: 'Job type not found' });
        if (result.error) return res.status(400).json({ message: result.error });

        return res.status(200).json({ jobType: result });
    } catch (err) {
        console.error('Error removing subtype field:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.updateSubTypeField = async (req, res) => {
    try {
        const { id, subTypeName, fieldName } = req.params;
        const fieldData = req.body;

        const result = await jobTypeService.updateSubTypeField(id, decodeURIComponent(subTypeName), decodeURIComponent(fieldName), fieldData);
        if (!result) return res.status(404).json({ message: 'Job type not found' });
        if (result.error) return res.status(400).json({ message: result.error });

        return res.status(200).json({ jobType: result });
    } catch (err) {
        console.error('Error updating subtype field:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Bulk import job types and items
module.exports.bulkImport = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid data format. Expected an array of items.' });
        }

        const results = await jobTypeService.bulkImport(items);
        return res.status(200).json({ message: 'Bulk import processed', results });
    } catch (err) {
        console.error('Error in bulk import:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Export all job types in flat format for CSV
module.exports.exportJobTypes = async (req, res) => {
    try {
        const flatData = await jobTypeService.exportAllJobTypes();
        return res.status(200).json({ data: flatData });
    } catch (err) {
        console.error('Error exporting job types:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
