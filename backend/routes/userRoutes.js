const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/getUser/:id', authMiddleware.checkAdmin([]), userController.getUser);

router.get('/getAllUsers', authMiddleware.checkAdmin([]), userController.getAllUsers);

router.post('/register-user', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('companyId').isLength({ min: 1 }).withMessage('Company Id is required'),
    body('role').isLength({ min: 1 }).withMessage('Role is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authMiddleware.checkAdmin([]), userController.createUser);

router.post('/update-user/:id', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('companyId').isLength({ min: 1 }).withMessage('Company Id is required'),
    body('role').isLength({ min: 1 }).withMessage('Role is required'),
    body('password').optional({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authMiddleware.checkAdmin([]), userController.updateUser);

router.get('/deleteUser/:id', authMiddleware.checkAdmin([]), userController.deleteUser);


module.exports = router;