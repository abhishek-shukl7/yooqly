const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const invoiceController = require('../controllers/invoiceController');
const { checkAdmin } = require('../middlewares/authMiddleware');

router.get('/getInvoice/:id',checkAdmin(['invoice']),invoiceController.getInvoice);

router.get('/getAllInvoices',checkAdmin(['invoice']),invoiceController.getAllInvoices);

router.post('/add-invoice',[
    body('customerId').isLength({ min: 1 }).withMessage('customerId is required'),
    body('quoteId').isLength({ min: 1 }).withMessage('quoteId is required'),
    body('status').isLength({ min: 1 }).withMessage('status is required'),
    body('invoiceDate').isLength({ min: 1 }).withMessage('invoiceDate is required'),
    body('dueDate').isLength({ min: 1 }).withMessage('dueDate is required'),
    body('invoiceTotal').isLength({ min: 1 }).withMessage('invoiceTotal is required')
],checkAdmin(['invoice']),invoiceController.createInvoice);

router.post('/update-invoice/:id',[
   body('customerId').isLength({ min: 1 }).withMessage('customerId is required'),
    body('quoteId').isLength({ min: 1 }).withMessage('quoteId is required'),
    body('status').isLength({ min: 1 }).withMessage('status is required'),
    body('invoiceDate').isLength({ min: 1 }).withMessage('invoiceDate is required'),
    body('dueDate').isLength({ min: 1 }).withMessage('dueDate is required'),
    body('invoiceTotal').isLength({ min: 1 }).withMessage('invoiceTotal is required')
],checkAdmin(['invoice']),invoiceController.updateInvoice);

// router.get('/deleteInvoice/:id',checkAdmin(['invoice']),invoiceController.deleteInvoice);


module.exports = router;