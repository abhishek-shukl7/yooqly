// Email Templates Index
// Aggregates all templates for easy import

const customerJoined = require('./customerJoined');
const jobCreated = require('./jobCreated');
const sendQuote = require('./sendQuote');
const quoteStatus = require('./quoteStatus');
const productionUpdate = require('./productionUpdate');
const userRegistered = require('./userRegistered');

const templates = {
  customerJoined,
  jobCreated,
  sendQuote,
  quoteStatus,
  productionJobUpdate: productionUpdate, // Alias for backward compatibility
  userRegistered
};

module.exports = templates;
