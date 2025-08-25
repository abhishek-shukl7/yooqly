const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/getDriver',authMiddleware.checkDriver,driverController.getDriver);

router.get('/logout',authMiddleware.checkDriver,driverController.logoutDriver);

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn([ 'car', 'motorcycle', 'auto' ]).withMessage('Invalid vehicle type')
],driverController.createDriver);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],driverController.loginDriver);

module.exports = router;