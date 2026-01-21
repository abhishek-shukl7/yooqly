// Email Settings Routes
const express = require('express');
const router = express.Router();
const emailSettingsService = require('../services/emailSettingsService');
const { checkAdmin } = require('../middlewares/authMiddleware');

/**
 * GET /api/settings/email
 * Get email settings for current company
 */
router.get('/', checkAdmin(['admin']), async (req, res) => {
  try {
    const companyId = req.user.company.companyId;
    const settings = await emailSettingsService.getEmailSettings(companyId);
    return res.status(200).json({ emailSettings: settings });
  } catch (err) {
    console.error('Error fetching email settings:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

/**
 * POST /api/settings/email
 * Update email settings for current company
 * Body: { enabled?: boolean, jobCreated?: boolean, quoteSent?: boolean, ... }
 */
router.post('/', checkAdmin(['admin']), async (req, res) => {
  try {
    const companyId = req.user.company.companyId;
    const settings = req.body;

    // Validate that only allowed fields are being updated
    const allowedFields = ['enabled', 'jobCreated', 'quoteSent', 'quoteStatus', 'customerWelcome', 'userRegistered', 'onboarding'];
    const filteredSettings = {};

    for (const field of allowedFields) {
      if (settings[field] !== undefined) {
        filteredSettings[field] = Boolean(settings[field]);
      }
    }

    const updatedSettings = await emailSettingsService.updateEmailSettings(companyId, filteredSettings);
    return res.status(200).json({ emailSettings: updatedSettings, message: 'Email settings updated successfully' });
  } catch (err) {
    console.error('Error updating email settings:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

module.exports = router;
