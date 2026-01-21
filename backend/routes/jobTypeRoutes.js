const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const jobTypeController = require('../controllers/jobTypeController');

router.get('/getAllJobTypes', jobTypeController.getAllJobTypes);
router.post('/addJobTypes', jobTypeController.createJobType);
router.put('/updateJobTypes/:id', jobTypeController.updateJobType);
router.delete('/deleteJobTypes/:id', jobTypeController.deleteJobType);
router.post('/addJobTypeItem/:id', jobTypeController.addJobItem);
router.delete('/removeJobTypeItem/:id/:itemName', jobTypeController.removeJobItem);
router.post('/bulkImport', jobTypeController.bulkImport);
router.get('/export', jobTypeController.exportJobTypes);

// Category Field CRUD
router.post('/addCategoryField/:id', jobTypeController.addCategoryField);
router.delete('/removeCategoryField/:id/:fieldName', jobTypeController.removeCategoryField);
router.put('/updateCategoryField/:id/:fieldName', jobTypeController.updateCategoryField);

// SubType Field CRUD
router.post('/addSubTypeField/:id/:subTypeName', jobTypeController.addSubTypeField);
router.delete('/removeSubTypeField/:id/:subTypeName/:fieldName', jobTypeController.removeSubTypeField);
router.put('/updateSubTypeField/:id/:subTypeName/:fieldName', jobTypeController.updateSubTypeField);

module.exports = router;