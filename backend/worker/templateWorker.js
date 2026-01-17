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
    sendQuote: ({ quoteId, quoteDetails, approveLink, rejectLink }) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333; text-align: center;">Quote #${quoteId}</h2>
            <p style="color: #555; line-height: 1.6;">Hello,</p>
            <p style="color: #555; line-height: 1.6;">You have received a new quote. Please review the details below:</p>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #333;">${quoteDetails}</p>
            </div>

            <p style="color: #555; line-height: 1.6;">Please choose an action below:</p>

            <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
                <a href="${approveLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 15px;">Approve Quote</a>
                <a href="${rejectLink}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reject Quote</a>
            </div>

            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
                Or copy and paste these links if the buttons don't work:<br>
                Approve: ${approveLink}<br>
                Reject: ${rejectLink}
            </p>
        </div>
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
