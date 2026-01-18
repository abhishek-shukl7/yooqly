const { validationResult } = require("express-validator");
const quoteModel = require("../models/quoteModel");
const quoteService = require("../services/quoteService");
const productionJobModel = require("../models/productionJobModel"); // Import for email trigger
const customerService = require("../services/customerService");
const templateWorker = require('../worker/templateWorker');
const emailWorker = require('../services/emailWorker');
const emailSettingsService = require('../services/emailSettingsService');
const jwt = require('jsonwebtoken');
const renderStyledPage = require('../templates/web/styledPage');

module.exports.getQuote = async (req, res, next) => {
    try {
        const quote = await quoteService.getQuoteById(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: 'quote not found.' });
        }
        return res.status(200).json({ quote });
    } catch (err) {
        console.error('Error fetching quote by ID:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.createQuote = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { customerId, jobId, orderId, tax, terms, requirements, quoteTotal, quoteItems, quoteDeadline, status } = req.body;
    const quote = await quoteService.createQuote({
        companyId: req.user.company.companyId,
        userId: req.user.user.userId,
        customerId,
        jobId,
        orderId,
        quoteDeadline,
        tax,
        terms,
        requirements,
        quoteTotal,
        quoteItems,
        status // Pass status to service
    });

    // Email Trigger: If created as 'sent', trigger email (if enabled)
    if (status === 'sent') {
        try {
            const emailEnabled = await emailSettingsService.isEmailEnabled(req.user.company.companyId, 'quoteSent');
            if (emailEnabled) {
                const customer = await customerService.getCustomerById(customerId);
                if (customer && customer.customerEmail) {
                    sendQuoteEmail(quote._id, quote, customer.customerEmail, req.user.company.currencySymbol);
                }
            }
        } catch (err) {
            console.error('Error sending quote email on create:', err);
        }
    }

    return res.status(200).json({ quote: quote });
}

module.exports.quoteApproval = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id, status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
    }

    try {
        const updatedQuote = await quoteService.quoteApproval(id, status);
        if (!updatedQuote) {
            return res.status(404).json({ message: 'quote not found.' });
        }
        // Send quote status email (if enabled)
        const emailEnabled = await emailSettingsService.isEmailEnabled(req.user.company.companyId, 'quoteStatus');
        if (emailEnabled) {

            if (status === 'approved') {
                // Send "Approved & Production Started" email
                // Fetch the created production job to get details
                // Production Job might take a ms to be created? quoteServce awaits it, so it should be there.
                const productionJob = await productionJobModel.findOne({ quoteId: id });
                // We also need customer email. Is it populated in updatedQuote? No, service returns quoteStatus which is just doc.
                // But quoteService.quoteApproval creates productionJob using quoteStatus.customerId.
                const customer = await customerService.getCustomerById(updatedQuote.customerId);

                if (customer && customer.customerEmail && productionJob) {
                    sendQuoteApprovedProductionEmail(
                        updatedQuote.quoteId, // Readable ID e.g. 1001? Wait, quoteModel has quoteId? No, mostly _id or orderId.
                        // updatedQuote doesn't have 'quoteId' field unless auto-increment. Usually user sees OrderId?
                        // In sendQuoteStatusEmail below (original code), it passed 'id'.
                        // Let's use updatedQuote.orderId or _id.
                        // sendQuoteEmail uses quoteId (param id).
                        updatedQuote._id, // quoteId
                        updatedQuote.orderId,
                        productionJob.jobDetails,
                        customer.customerEmail,
                        customer.customerName || customer.firstName
                    );
                } else if (customer && customer.customerEmail) {
                    // Fallback if production job not found (rare)
                    sendQuoteStatusEmail(id, status, updatedQuote.rejectionReason, customer.customerEmail);
                }

            } else {
                // Rejected - generic status email
                // Need customer email. Original code used req.user.email which is ADMIN!
                // Fix: Send to Customer.
                const customer = await customerService.getCustomerById(updatedQuote.customerId);
                if (customer && customer.customerEmail) {
                    sendQuoteStatusEmail(id, status, updatedQuote.rejectionReason, customer.customerEmail);
                }
            }
        }
        return res.status(200).json({ quote: updatedQuote });
    } catch (err) {
        console.error('Error updating quote:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Helper to render styled HTML pages - REMOVED (Imported from templates/web/styledPage)

module.exports.processQuoteResponse = async (req, res) => {
    // Support token in Query (GET) or Body (POST)
    const token = req.query.token || req.body.token;

    if (!token) return res.status(400).send(renderStyledPage('Invalid Link', '<h1>Invalid Link</h1><p>The link you used is invalid or missing a token.</p>', '#ef4444'));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        const { quoteId, action, type } = decoded;

        // Security Check: Token Scope
        if (type !== 'quote_approval') {
            return res.status(400).send(renderStyledPage('Invalid Token', '<h1>Invalid Token</h1><p>This token is not valid for quote approval.</p>', '#ef4444'));
        }

        // Check if quote exists
        const existingQuote = await quoteService.getQuoteById(quoteId);
        if (!existingQuote) {
            return res.status(404).send(renderStyledPage('Quote Not Found', '<h1>Quote Not Found</h1><p>The quote you are looking for does not exist.</p>', '#ef4444'));
        }

        // Check if already processed
        if (['approved', 'rejected'].includes(existingQuote.status)) {
            const statusColor = existingQuote.status === 'approved' ? '#10b981' : '#ef4444';
            const icon = existingQuote.status === 'approved' ? '✓' : '✕';
            return res.send(renderStyledPage('Link Expired', `
                <div style="background-color: ${existingQuote.status === 'approved' ? '#d1fae5' : '#fee2e2'}; color: ${statusColor}; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 28px;">${icon}</div>
                <h1>Already Processed</h1>
                <p>This quote has already been <strong>${existingQuote.status}</strong>.</p>
                <p>No further action is required.</p>
             `, statusColor));
        }

        // ==========================
        // GET REQUEST: Show Confirmation Page
        // ==========================
        if (req.method === 'GET') {
            const actionText = action.charAt(0).toUpperCase() + action.slice(1); // "Approve" or "Reject"
            const themeColor = action === 'approved' ? '#10b981' : '#ef4444'; // Green or Red

            return res.send(renderStyledPage(`Confirm ${actionText}`, `
                <h1>Confirm ${actionText}?</h1>
                <p>You are about to <strong>${action}</strong> Quote #${existingQuote.id || existingQuote.orderId}.</p>
                <p style="margin-bottom: 32px;">Total Amount: <strong>${req.user?.company?.currencySymbol || ''}${existingQuote.quoteTotal}</strong></p>

                <form action="/api/quotes/respond" method="POST">
                    <input type="hidden" name="token" value="${token}" />
                    <button type="submit" class="btn" style="background-color: ${themeColor}">Confirm ${actionText}</button>
                </form>
            `, themeColor));
        }

        // ==========================
        // POST REQUEST: Execute Action
        // ==========================
        if (req.method === 'POST') {
            // Update quote status
            const updatedQuote = await quoteService.quoteApproval(quoteId, action);

            // Send Email Notification if Approved
            if (action === 'approved') {
                try {
                    // Check email setting (use companyId directly)
                    const emailEnabled = await emailSettingsService.isEmailEnabled(existingQuote.companyId, 'quoteStatus');

                    if (emailEnabled) {
                        const productionJob = await productionJobModel.findOne({ quoteId: quoteId });
                        const customer = await customerService.getCustomerById(existingQuote.customerId);

                        if (customer && customer.customerEmail && productionJob) {
                            sendQuoteApprovedProductionEmail(
                                existingQuote._id,
                                existingQuote.orderId,
                                productionJob.jobDetails,
                                customer.customerEmail,
                                customer.customerName || customer.firstName
                            );
                        } else if (customer && customer.customerEmail) {
                            sendQuoteStatusEmail(quoteId, action, null, customer.customerEmail);
                        }
                    }
                } catch (err) {
                    console.error('Error sending approval email in magic link flow:', err);
                }
            } else if (action === 'rejected') {
                try {
                    const emailEnabled = await emailSettingsService.isEmailEnabled(existingQuote.companyId, 'quoteStatus');
                    if (emailEnabled) {
                        const customer = await customerService.getCustomerById(existingQuote.customerId);
                        if (customer && customer.customerEmail) {
                            sendQuoteStatusEmail(quoteId, action, null, customer.customerEmail);
                        }
                    }
                } catch (err) {
                    console.error('Error sending rejection email in magic link flow:', err);
                }
            }

            // Render Success Page
            const actionText = action === 'approved' ? 'Approved' : 'Rejected';
            const themeColor = action === 'approved' ? '#10b981' : '#ef4444';
            const icon = action === 'approved' ? '✓' : '✕';

            return res.send(renderStyledPage(`Quote ${actionText}`, `
                <div style="background-color: ${action === 'approved' ? '#d1fae5' : '#fee2e2'}; color: ${themeColor}; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto; font-size: 32px;">${icon}</div>
                <h1>Quote ${actionText}</h1>
                <p>Thank you. The quote has been successfully ${action}.</p>
                <p>A confirmation email has been sent.</p>
            `, themeColor));
        }

    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(400).send(renderStyledPage('Invalid Link', '<h1>Link Expired</h1><p>This link is invalid or has expired.</p>', '#ef4444'));
    }
};

module.exports.updateQuote = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedQuote = await quoteService.updateQuote(req.params.id, req.body);
        if (!updatedQuote) {
            return res.status(404).json({ message: 'quote not found.' });
        }

        // Trigger Email if status is changed to 'sent' (if enabled)
        if (req.body.status === 'sent') {
            try {
                const emailEnabled = await emailSettingsService.isEmailEnabled(req.user.company.companyId, 'quoteSent');
                if (emailEnabled) {
                    const customer = await customerService.getCustomerById(updatedQuote.customerId);
                    if (customer && customer.customerEmail) {
                        sendQuoteEmail(updatedQuote._id, updatedQuote, customer.customerEmail, req.user.company.currencySymbol);
                    }
                }
            } catch (err) {
                console.error('Error sending quote email on update:', err);
            }
        }

        return res.status(200).json({ quote: updatedQuote });
    } catch (err) {
        console.error('Error updating quote:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports.getAllQuotes = async (req, res) => {
    try {
        const quotes = await quoteService.getAllQuotes(req.user.company.companyId);
        return res.status(200).json({ quotes });
    } catch (err) {
        console.error('Error fetching all quotes:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Send quote email with currency symbol
async function sendQuoteEmail(quoteId, quoteDetails, toEmail, currencySymbol = '£') {
    // Generate Magic Links
    const secret = process.env.JWT_SECRET || 'secret_key';
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';

    const approveToken = jwt.sign({ quoteId, action: 'approved', type: 'quote_approval' }, secret, { expiresIn: '2d' });
    const rejectToken = jwt.sign({ quoteId, action: 'rejected', type: 'quote_approval' }, secret, { expiresIn: '2d' });

    const approveLink = `${baseUrl}/api/quotes/respond?token=${approveToken}`;
    const rejectLink = `${baseUrl}/api/quotes/respond?token=${rejectToken}`;

    const html = templateWorker.getTemplate('sendQuote', { quoteId, quote: quoteDetails, approveLink, rejectLink, currencySymbol });

    await emailWorker.sendEmail({
        from: 'testclient@hackersdaddy.com',
        to: toEmail,
        subject: 'Your Quote #' + quoteId,
        html
    });
}

// Send quote approved & production started email
async function sendQuoteApprovedProductionEmail(quoteId, orderId, items, toEmail, customerName) {
    const html = templateWorker.getTemplate('quoteApprovedProduction', { quoteId, orderId, items, customerName });
    await emailWorker.sendEmail({
        from: 'testclient@hackersdaddy.com',
        to: toEmail,
        subject: `Quote Approved - Production Started (Order #${orderId})`,
        html
    });
}

async function sendQuoteStatusEmail(quoteId, status, rejectionReason, toEmail) {
    const html = templateWorker.getTemplate('quoteStatus', { quoteId, status, rejectionReason });
    await emailWorker.sendEmail({
        from: 'testclient@hackersdaddy.com',
        to: toEmail,
        subject: `Quote ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html
    });
}

module.exports.deleteQuote = async (req, res) => {
    try {
        const deletedQuote = await QuoteService.deleteQuote(req.params.id);
        if (!deletedQuote) {
            return res.status(404).json({ message: 'quote not found.' });
        }
        return res.status(200).json({ message: 'quote deleted successfully.' });
    } catch (err) {
        console.error('Error deleting quote:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};