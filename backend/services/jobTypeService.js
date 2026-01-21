const jobTypeModel = require('../models/jobTypeModel');
const { v4: uuidv4 } = require('uuid');

module.exports.getAllJobTypes = async () => {
    return await jobTypeModel.find();
};

module.exports.createJobType = async ({ name, type, fields, customId }) => {
    console.log('Creating job type with fields:', { name, type, fields, customId });
    const jobType = await jobTypeModel.create({
        name,
        type,
        fields,
        customId: customId || uuidv4()
    });
    return jobType;
}

module.exports.updateJobType = async (id, { name, type, fields, customId }) => {
    const updateData = { name, type, fields };
    if (customId) updateData.customId = customId;

    const jobType = await jobTypeModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    );
    return jobType;
}

module.exports.deleteJobType = async (id) => {
    const result = await jobTypeModel.findByIdAndDelete(id);
    return result;
}

module.exports.addJobItem = async (id, itemData) => {
    // Generate customId for subtype if not provided
    if (!itemData.customId) {
        itemData.customId = uuidv4();
    }

    const jobType = await jobTypeModel.findById(id);
    if (!jobType) return null;

    jobType.type.push(itemData);
    await jobType.save();
    return jobType;
}

module.exports.removeJobItem = async (id, itemName) => {
    const jobType = await jobTypeModel.findByIdAndUpdate(
        id,
        { $pull: { type: { name: itemName } } },
        { new: true }
    );
    return jobType;
}

// ============ Category Field CRUD ============
module.exports.addCategoryField = async (id, fieldData) => {
    const jobType = await jobTypeModel.findById(id);
    if (!jobType) return null;

    // Check if field already exists
    const exists = jobType.fields.some(f => f.name === fieldData.name);
    if (exists) return { error: 'Field already exists' };

    jobType.fields.push(fieldData);
    await jobType.save();
    return jobType;
}

module.exports.removeCategoryField = async (id, fieldName) => {
    const jobType = await jobTypeModel.findByIdAndUpdate(
        id,
        { $pull: { fields: { name: fieldName } } },
        { new: true }
    );
    return jobType;
}

module.exports.updateCategoryField = async (id, fieldName, fieldData) => {
    const jobType = await jobTypeModel.findById(id);
    if (!jobType) return null;

    const fieldIndex = jobType.fields.findIndex(f => f.name === fieldName);
    if (fieldIndex === -1) return { error: 'Field not found' };

    jobType.fields[fieldIndex] = { ...jobType.fields[fieldIndex], ...fieldData };
    await jobType.save();
    return jobType;
}

// ============ SubType Field CRUD ============
module.exports.addSubTypeField = async (id, subTypeName, fieldData) => {
    const jobType = await jobTypeModel.findById(id);
    if (!jobType) return null;

    const subType = jobType.type.find(t => t.name === subTypeName);
    if (!subType) return { error: 'SubType not found' };

    const exists = subType.fields.some(f => f.name === fieldData.name);
    if (exists) return { error: 'Field already exists' };

    subType.fields.push(fieldData);
    await jobType.save();
    return jobType;
}

module.exports.removeSubTypeField = async (id, subTypeName, fieldName) => {
    const jobType = await jobTypeModel.findById(id);
    if (!jobType) return null;

    const subType = jobType.type.find(t => t.name === subTypeName);
    if (!subType) return { error: 'SubType not found' };

    subType.fields = subType.fields.filter(f => f.name !== fieldName);
    await jobType.save();
    return jobType;
}

module.exports.updateSubTypeField = async (id, subTypeName, fieldName, fieldData) => {
    const jobType = await jobTypeModel.findById(id);
    if (!jobType) return null;

    const subType = jobType.type.find(t => t.name === subTypeName);
    if (!subType) return { error: 'SubType not found' };

    const fieldIndex = subType.fields.findIndex(f => f.name === fieldName);
    if (fieldIndex === -1) return { error: 'Field not found' };

    subType.fields[fieldIndex] = { ...subType.fields[fieldIndex], ...fieldData };
    await jobType.save();
    return jobType;
}

// ============ Bulk Import ============
module.exports.bulkImport = async (items) => {
    const results = [];

    // Group items by category
    const categoryMap = {};
    for (const item of items) {
        if (!item.category) continue;

        if (!categoryMap[item.category]) {
            categoryMap[item.category] = {
                categoryFields: [],
                subtypes: {}
            };
        }

        const cat = categoryMap[item.category];

        // Helper to parse boolean from string or boolean
        const parseBool = (val) => val === 'true' || val === true;

        // Build field object with allowsCustomInput and customInputLabel support
        const fieldData = {
            name: item.fieldName,
            required: parseBool(item.required),
            values: item.values ? item.values.split('|').map(v => v.trim()).filter(Boolean) : [],
            allowsCustomInput: parseBool(item.allowsCustomInput),
            customInputLabel: item.customInputLabel || 'Other'
        };

        if (item.fieldLevel === 'category') {
            cat.categoryFields.push(fieldData);
        } else if (item.fieldLevel === 'subtype' && item.subType) {
            if (!cat.subtypes[item.subType]) {
                cat.subtypes[item.subType] = [];
            }
            cat.subtypes[item.subType].push(fieldData);
        }
    }

    // Process each category
    for (const [categoryName, data] of Object.entries(categoryMap)) {
        let jobType = await jobTypeModel.findOne({ name: categoryName });

        if (!jobType) {
            const typeArray = Object.entries(data.subtypes).map(([stName, fields]) => ({
                name: stName,
                customId: uuidv4(),
                fields: fields
            }));

            jobType = await jobTypeModel.create({
                name: categoryName,
                customId: uuidv4(),
                type: typeArray,
                fields: data.categoryFields
            });
            results.push({ category: categoryName, status: 'created' });
        } else {
            for (const newField of data.categoryFields) {
                const existingField = jobType.fields.find(f => f.name === newField.name);
                if (!existingField) {
                    jobType.fields.push(newField);
                }
            }

            for (const [stName, newFields] of Object.entries(data.subtypes)) {
                let existingSubType = jobType.type.find(t => t.name === stName);
                if (!existingSubType) {
                    jobType.type.push({ name: stName, customId: uuidv4(), fields: newFields });
                } else {
                    for (const newField of newFields) {
                        const existingField = existingSubType.fields.find(f => f.name === newField.name);
                        if (!existingField) {
                            existingSubType.fields.push(newField);
                        }
                    }
                }
            }

            await jobType.save();
            results.push({ category: categoryName, status: 'updated' });
        }
    }

    return results;
}

// ============ Export All Job Types (Flat Format for CSV) ============
module.exports.exportAllJobTypes = async () => {
    const jobTypes = await jobTypeModel.find();
    const flatData = [];

    for (const jobType of jobTypes) {
        // Export category-level fields
        for (const field of jobType.fields) {
            flatData.push({
                category: jobType.name,
                subType: '',
                fieldLevel: 'category',
                fieldName: field.name,
                required: field.required ? 'true' : 'false',
                values: (field.values || []).join('|'),
                allowsCustomInput: field.allowsCustomInput ? 'true' : 'false',
                customInputLabel: field.customInputLabel || 'Other'
            });
        }

        // Export subtype-level fields
        for (const subType of jobType.type) {
            for (const field of subType.fields) {
                flatData.push({
                    category: jobType.name,
                    subType: subType.name,
                    fieldLevel: 'subtype',
                    fieldName: field.name,
                    required: field.required ? 'true' : 'false',
                    values: (field.values || []).join('|'),
                    allowsCustomInput: field.allowsCustomInput ? 'true' : 'false',
                    customInputLabel: field.customInputLabel || 'Other'
                });
            }
        }
    }

    return flatData;
}

