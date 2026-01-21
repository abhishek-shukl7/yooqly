// Email Settings Service
const companyModel = require('../models/companyModel');

// Default email settings
const defaultEmailSettings = {
  enabled: true,
  jobCreated: true,
  quoteSent: true,
  quoteStatus: true,
  customerWelcome: true,
  userRegistered: true,
  productionCompleted: true,
  onboarding: true
};

/**
 * Get email settings for a company
 * @param {string} companyId
 * @returns {Object} Email settings
 */
async function getEmailSettings(companyId) {
  const company = await companyModel.findById(companyId).select('emailSettings');
  if (!company) {
    throw new Error('Company not found');
  }
  return company.emailSettings || defaultEmailSettings;
}

/**
 * Update email settings for a company
 * @param {string} companyId
 * @param {Object} settings - Partial email settings to update
 * @returns {Object} Updated email settings
 */
async function updateEmailSettings(companyId, settings) {
  const company = await companyModel.findById(companyId);
  if (!company) {
    throw new Error('Company not found');
  }

  // Merge with existing settings
  const currentSettings = company.emailSettings || defaultEmailSettings;
  const updatedSettings = { ...currentSettings, ...settings };

  company.emailSettings = updatedSettings;
  await company.save();

  return company.emailSettings;
}

/**
 * Check if a specific email type is enabled for a company
 * @param {string} companyId
 * @param {string} emailType - One of: jobCreated, quoteSent, quoteStatus, customerWelcome, userRegistered, onboarding
 * @returns {boolean}
 */
async function isEmailEnabled(companyId, emailType) {
  try {
    const settings = await getEmailSettings(companyId);

    // Check if master switch is enabled
    if (!settings.enabled) {
      return false;
    }

    // Check specific email type
    return settings[emailType] !== false;
  } catch (err) {
    console.error('Error checking email settings:', err);
    // Default to enabled if there's an error
    return true;
  }
}

module.exports = {
  getEmailSettings,
  updateEmailSettings,
  isEmailEnabled,
  defaultEmailSettings
};
