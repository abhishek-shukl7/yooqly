const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const quoteController = require('../controllers/quoteController');
const { checkAdmin } = require('../middlewares/authMiddleware');

router.get('/getQuote/:id',checkAdmin(['quote']),quoteController.getQuote);

router.get('/getAllQuotes',checkAdmin(['quote']),quoteController.getAllQuotes);

router.post('/add-quote',[
        body('customerId').isMongoId().withMessage('customerId is required and must be a valid ID.'),
        body('jobId').isMongoId().withMessage('jobId is required and must be a valid ID.'),
        // body('status').isIn(['draft', 'sent', 'approved', 'rejected']).withMessage('Invalid quote status.'),
        body('orderId').isLength({ min: 4 }).withMessage('orderId is required'),
        body('tax').isLength({ min: 1 }).withMessage('tax is required'),
        body('quoteTotal').isLength({ min: 1 }).withMessage('quoteTotal is required'),
        body('quoteItems').isArray({ min: 1 }).withMessage('quoteItems must be a non-empty array.'),
        body('quoteItems.*.itemName').notEmpty().withMessage('Item name is required.'),
        body('quoteItems.*.quantity').isNumeric().withMessage('Quantity must be a number.'),
        body('quoteItems.*.unitPrice').isNumeric().withMessage('Unit price must be a number.'),
        body('quoteItems.*.totalPrice').isNumeric().withMessage('Total price must be a number.')
],checkAdmin(['quote']),quoteController.createQuote);

router.post('/update-quote/:id',[
        // param('id').isMongoId().withMessage('Invalid Quote ID.'),
        body('customerId').optional().isMongoId().withMessage('customerId must be a valid ID.'),
        body('jobId').optional().isMongoId().withMessage('jobId must be a valid ID.'),
        // body('status').optional().isIn(['draft', 'sent', 'approved', 'rejected']).withMessage('Invalid quote status.'),
        body('quoteItems').optional().isArray({ min: 1 }).withMessage('quoteItems must be a non-empty array.'),
        body('quoteItems.*.itemName').optional().notEmpty().withMessage('Item name is required.'),
        body('quoteItems.*.quantity').optional().isNumeric().withMessage('Quantity must be a number.'),
        body('quoteItems.*.unitPrice').optional().isNumeric().withMessage('Unit price must be a number.'),
        body('quoteItems.*.totalPrice').optional().isNumeric().withMessage('Total price must be a number.')
],checkAdmin(['quote']),quoteController.updateQuote);

router.post('/quote-approval',[
        body('id').isMongoId().withMessage('Invalid Quote ID.'),
        // body('customerId').optional().isMongoId().withMessage('customerId must be a valid ID.'),
        // body('jobId').optional().isMongoId().withMessage('jobId must be a valid ID.'),
],checkAdmin(['quote-approval']),quoteController.quoteApproval);

// router.get('/deleteQuote/:id',checkAdmin(['quote']),quoteController.deleteQuote);


module.exports = router;