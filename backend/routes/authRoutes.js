const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],authController.login);


module.exports = router;