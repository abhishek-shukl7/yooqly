const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productionJobController = require('../controllers/productionJobController');
const { checkAdmin } = require('../middlewares/authMiddleware');

router.get('/getProductionJob/:id', checkAdmin(['production']), productionJobController.getProductionJob);

router.get('/getAllProductionJobs', checkAdmin(['production']), productionJobController.getAllProductionJobs);

router.post('/add-production-job', [
    body('jobId').isMongoId().withMessage('jobId is required and must be a valid ID.'),
    body('quoteId').optional().isMongoId().withMessage('quoteId must be a valid ID.'),
    body('jobDetails').isArray({ min: 1 }).withMessage('jobDetails must be a non-empty array.'),
    body('jobDetails.*.type').notEmpty().withMessage('jobDetails.type is required.'),
    body('jobDetails.*.status').optional().isIn(['Pending','In Production','Completed','On Hold','Cancelled']).withMessage('Invalid status for jobDetails item.'),
], checkAdmin(['production']), productionJobController.createProductionJob);

router.post('/update-production-job/:id', [
    body('jobId').optional().isMongoId().withMessage('jobId must be a valid ID.'),
    body('quoteId').optional().isMongoId().withMessage('quoteId must be a valid ID.'),
    body('jobDetails').optional().isArray({ min: 1 }).withMessage('jobDetails must be a non-empty array.'),
], checkAdmin(['production']), productionJobController.updateProductionJob);

router.get('/delete-production-job/:id', checkAdmin(['production']), productionJobController.deleteProductionJob);

module.exports = router;
