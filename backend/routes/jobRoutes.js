const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const jobController = require('../controllers/jobController');
const { checkAdmin }  = require('../middlewares/authMiddleware');

router.get('/getJob/:id',checkAdmin(['orders']),jobController.getJob);

router.get('/getAllJobs',checkAdmin(['orders']),jobController.getAllJobs);

router.post('/add-job',[
    body('customerId').isLength({ min: 1 }).withMessage('customerId is required'),
    body('quantity').isLength({ min: 1 }).withMessage('quantity is required'),
    body('type').isLength({ min: 1 }).withMessage('type is required'),
    body('requirements').isLength({ min: 1 }).withMessage('requirements is required'),
],checkAdmin(['orders']),jobController.createJob);

router.post('/update-job/:id',[
   body('customerId').isLength({ min: 1 }).withMessage('customerId is required'),
    body('quantity').isLength({ min: 1 }).withMessage('quantity is required'),
    body('type').isLength({ min: 1 }).withMessage('type is required'),
    body('requirements').isLength({ min: 1 }).withMessage('requirements is required'),
],checkAdmin(['orders']),jobController.updateJob);

// router.get('/deleteJob/:id',checkAdmin(['orders']),jobController.deleteJob);

router.get('/getProduction',checkAdmin(['production']),jobController.getProductionJobs);

module.exports = router;