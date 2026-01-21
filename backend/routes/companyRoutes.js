const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');
const { cacheMiddleware } = require('../utils/cache');

router.get('/getCompany/:id', authMiddleware.checkAdmin([]), cacheMiddleware(300), companyController.getCompany);

// router.get('/getAllCompanies',authMiddleware.checkSuperAdmin,companyController.getAllCompanies);

router.post('/register-company', [
    body('companyEmail').isEmail().withMessage('Invalid Email'),
    body('companyName').isLength({ min: 3 }).withMessage('Company Name must be at least 3 characters long'),
    body('currency').isLength({ min: 1 }).withMessage('currency is required'),
], authMiddleware.checkAdmin([]), companyController.createCompany);

router.post('/update-company/:id', [
    body('companyEmail').isEmail().withMessage('Invalid Email'),
    body('companyName').isLength({ min: 3 }).withMessage('Company Name must be at least 3 characters long'),
    body('currency').isLength({ min: 1 }).withMessage('currency is required'),
], authMiddleware.checkAdmin([]), companyController.updateCompany);

router.get('/deleteCompany/:id', authMiddleware.checkAdmin([]), companyController.deleteCompany);


module.exports = router;
