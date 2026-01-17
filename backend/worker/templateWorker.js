// worker/templateWorker.js
const emailWorker = require('../services/emailWorker');

const templates = {
    customerJoined: ({ customerName, companyName }) => `
        <h2>Welcome, ${customerName}!</h2>
        <p>Thank you for joining ${companyName}. We're excited to have you onboard.</p>
    `,
    jobCreated: ({ jobName, jobDetails }) => `
        <h2>New Job Created: ${jobName}</h2>
        <p>Details: ${jobDetails}</p>
    `,
    sendQuote: ({ quoteId, quoteDetails }) => `
        <h2>Your Quote #${quoteId}</h2>
        <p>${quoteDetails}</p>
    `,
    quoteStatus: ({ quoteId, status, reason }) => `
        <h2>Quote #${quoteId} ${status === 'approved' ? 'Approved' : 'Rejected'}</h2>
        <p>${status === 'approved' ? 'Congratulations! Your quote has been approved.' : `Sorry, your quote was rejected. Reason: ${reason}`}</p>
    `,
    productionJobUpdate: ({ jobName, updateDetails }) => `
        <h2>Production Job Update: ${jobName}</h2>
        <p>${updateDetails}</p>
    `,
    userRegistered: ({ userName, companyName }) => `
        <h2>Welcome, ${userName}!</h2>
        <p>You have been registered to ${companyName}. Please login to get started.</p>
    `
};

function getTemplate(type, params) {
    if (templates[type]) {
        return templates[type](params);
    }
    throw new Error('Template type not found');
}

module.exports = {
    getTemplate
};
