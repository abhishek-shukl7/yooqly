// worker/templateWorker.js
// Email template worker - uses modular templates from /templates/email/

const templates = require('../templates/email');

/**
 * Get an email template by type
 * @param {string} type - Template type (e.g., 'jobCreated', 'sendQuote')
 * @param {Object} params - Parameters to pass to the template
 * @returns {string} - HTML email content
 */
function getTemplate(type, params) {
    if (templates[type]) {
        return templates[type](params);
    }
    throw new Error(`Template type '${type}' not found`);
}

module.exports = {
    getTemplate
};
