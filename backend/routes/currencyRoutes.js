// Currency Routes
const express = require('express');
const router = express.Router();
const companyModel = require('../models/companyModel');
const { checkAdmin } = require('../middlewares/authMiddleware');
const redisClient = require('../config/redis');

/**
 * GET /api/currency
 * Get current company currency settings
 */
router.get('/', checkAdmin(['admin']), async (req, res) => {
  try {
    const company = await companyModel.findById(req.user.company.companyId).select('currency currencySymbol');
    return res.status(200).json({
      currency: company.currency,
      currencySymbol: company.currencySymbol
    });
  } catch (err) {
    console.error('Error fetching currency settings:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * POST /api/currency
 * Update company currency settings
 * Body: { currency: "GBP", currencySymbol: "£" }
 */
router.post('/', checkAdmin(['admin']), async (req, res) => {
  const { currency, currencySymbol } = req.body;

  if (!currency || !currencySymbol) {
    return res.status(400).json({ message: 'Currency and symbol are required.' });
  }

  try {
    const company = await companyModel.findByIdAndUpdate(
      req.user.company.companyId,
      { currency, currencySymbol },
      { new: true }
    ).select('currency currencySymbol');

    // Clear auth cache so new settings take effect immediately
    if (req.user.user && req.user.user.userId) {
      await redisClient.del(`auth:${req.user.user.userId}`);
    }

    return res.status(200).json({
      message: 'Currency settings updated successfully',
      currency: company.currency,
      currencySymbol: company.currencySymbol
    });
  } catch (err) {
    console.error('Error updating currency settings:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
