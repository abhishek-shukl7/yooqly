const { validationResult } = require("express-validator");
const quoteModel = require("../models/quoteModel");
const quoteService = require("../services/quoteService");
const templateWorker = require('../worker/templateWorker');
const emailWorker = require('../services/emailWorker');

module.exports.getQuote = async (req,res,next) => {
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

module.exports.createQuote = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    const  { customerId,jobId,orderId,tax,terms,requirements,quoteTotal,quoteItems,quoteDeadline }  = req.body;
    const quote = await quoteService.createQuote({
        companyId : req.user.company.companyId,
        userId: req.user.user.userId,
        customerId,
        jobId,
        orderId,
        quoteDeadline,
        tax,
        terms,
        requirements ,
        quoteTotal,
        quoteItems
    });

    // sendQuoteEmail(quote._id, quote, req.user.email);

    return res.status(200).json({quote: quote});
}

module.exports.quoteApproval = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
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
        sendQuoteStatusEmail(id, status, updatedQuote.rejectionReason, req.user.email);
        return res.status(200).json({ quote: updatedQuote });
    } catch (err) {
        console.error('Error updating quote:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports.updateQuote = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    try {
        const updatedQuote = await quoteService.updateQuote(req.params.id, req.body);
        if (!updatedQuote) {
            return res.status(404).json({ message: 'quote not found.' });
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

// Example: Send quote email
async function sendQuoteEmail(quoteId, quoteDetails, toEmail) {
    const html = templateWorker.getTemplate('sendQuote', { quoteId, quoteDetails });
    await emailWorker.sendEmail({
        from: 'Yooqly <no-reply@yooqly.com>',
        to: toEmail,
        subject: 'Your Quote #' + quoteId,
        html
    });
}

// Example: Send quote status email
async function sendQuoteStatusEmail(quoteId, status, reason, toEmail) {
    const html = templateWorker.getTemplate('quoteStatus', { quoteId, status, reason });
    await emailWorker.sendEmail({
        from: 'Yooqly <no-reply@yooqly.com>',
        to: toEmail,
        subject: `Quote #${quoteId} ${status === 'approved' ? 'Approved' : 'Rejected'}`,
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