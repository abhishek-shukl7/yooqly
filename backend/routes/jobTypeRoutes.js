const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const jobTypeController = require('../controllers/jobTypeController');

router.get('/getAllJobTypes',jobTypeController.getAllJobTypes);
router.post('/addJobTypes', jobTypeController.createJobType);
router.put('/updateJobTypes/:id', jobTypeController.updateJobType);
router.delete('/deleteJobTypes/:id', jobTypeController.deleteJobType);

module.exports = router;