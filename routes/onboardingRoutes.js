const express = require('express');
const { body } = require('express-validator');
const onboardingController = require('../controllers/onboardingController');

const router = express.Router();

router.post('/create-onboarding-token',onboardingController.sendOnboardingLink);

router.post(
    '/:token',
    [
        body('companyName').not().isEmpty().withMessage('Company name is required.'),
        body('companyEmail').isEmail().withMessage('Valid company email is required.'),
        body('currency').not().isEmpty().withMessage('Currency is required.'),
        body('timezone').not().isEmpty().withMessage('Timezone is required.'),
        body('name').not().isEmpty().withMessage('Your name is required.'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    ],
    onboardingController.onboardClient
);

module.exports = router;
