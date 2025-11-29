const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const jobTypeController = require('../controllers/jobTypeController');

router.get('/getAllJobTypes',jobTypeController.getAllJobTypes);

module.exports = router;