// Email Templates Index
// Aggregates all templates for easy import

const customerJoined = require('./customerJoined');
const jobCreated = require('./jobCreated');
const sendQuote = require('./sendQuote');
const quoteStatus = require('./quoteStatus');
const quoteApprovedProduction = require('./quoteApprovedProduction');
const productionUpdate = require('./productionUpdate');
const productionCompleted = require('./productionCompleted');
const userRegistered = require('./userRegistered');

const templates = {
  customerJoined,
  jobCreated,
  sendQuote,
  quoteStatus,
  quoteApprovedProduction,
  productionJobUpdate: productionUpdate, // Alias for backward compatibility
  productionCompleted,
  userRegistered
};

module.exports = templates;
