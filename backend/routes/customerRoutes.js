const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const customerController = require('../controllers/customerController');
const { checkAdmin }  = require('../middlewares/authMiddleware');

router.get('/getCustomer/:id',checkAdmin(['order-intake']),customerController.getCustomer);

router.get('/getAllCustomers',checkAdmin(['order-intake']),customerController.getAllCustomers);

router.post('/register-customer',[
    body('customerEmail').isEmail().withMessage('Invalid Email'),
    body('customerName').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('customerCompanyName').isLength({ min: 1 }).withMessage('Company Name is required')
],checkAdmin(['order-intake']),customerController.createCustomer);

router.post('/update-customer/:id',[
   body('customerEmail').isEmail().withMessage('Invalid Email'),
    body('customerName').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('customerCompanyName').isLength({ min: 1 }).withMessage('Company Name is required')
],checkAdmin(['order-intake']),customerController.updateCustomer);

router.delete('/deleteCustomer/:id',checkAdmin(['admin']),customerController.deleteCustomer);


module.exports = router;