const { validationResult } = require("express-validator");
const quoteModel = require("../models/quoteModel");
const quoteService = require("../services/quoteService");
const customerService = require("../services/customerService");
const templateWorker = require('../worker/templateWorker');
const emailWorker = require('../services/emailWorker');
const emailSettingsService = require('../services/emailSettingsService');
const jwt = require('jsonwebtoken');

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
            sendQuoteStatusEmail(id, status, updatedQuote.rejectionReason, req.user.email);
        }
        return res.status(200).json({ quote: updatedQuote });
    } catch (err) {
        console.error('Error updating quote:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports.processQuoteResponse = async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).send('Invalid request.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        const { quoteId, action } = decoded;

        // Check if quote is already processed
        const existingQuote = await quoteService.getQuoteById(quoteId);
        if (!existingQuote) {
            return res.status(404).send('Quote not found.');
        }

        if (existingQuote.status === 'approved' || existingQuote.status === 'rejected') {
            // Already processed - show info message
            return res.send(`
                <html>
                    <body style="font-family: Arial; text-align: center; padding-top: 50px;">
                        <h1 style="color: #666;">Quote Already Processed</h1>
                        <p>This quote has already been <strong>${existingQuote.status}</strong>.</p>
                        <p style="color: #888;">No further action is needed.</p>
                    </body>
                </html>
            `);
        }

        // Update quote status
        await quoteService.quoteApproval(quoteId, action);

        // Simple success page
        res.send(`
            <html>
                <body style="font-family: Arial; text-align: center; padding-top: 50px;">
                    <h1 style="color: ${action === 'approved' ? 'green' : 'red'};">Quote ${action === 'approved' ? 'Approved' : 'Rejected'}</h1>
                    <p>Thank you for your response. The quote status has been updated.</p>
                </body>
            </html>
        `);
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(400).send('Invalid or expired link.');
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

    const approveToken = jwt.sign({ quoteId, action: 'approved' }, secret, { expiresIn: '7d' });
    const rejectToken = jwt.sign({ quoteId, action: 'rejected' }, secret, { expiresIn: '7d' });

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