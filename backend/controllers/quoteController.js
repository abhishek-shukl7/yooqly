const { validationResult } = require("express-validator");
const quoteModel = require("../models/quoteModel");
const quoteService = require("../services/quoteService");

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

    return res.status(200).json({quote: quote});
}

module.exports.quoteApproval = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    try {
        const updatedQuote = await quoteService.quoteApproval(req.body.id);
        if (!updatedQuote) {
            return res.status(404).json({ message: 'quote not found.' });
        }
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


// module.exports.deleteQuote = async (req, res) => {
//     try {
//         const deletedQuote = await QuoteService.deleteQuote(req.params.id);
//         if (!deletedQuote) {
//             return res.status(404).json({ message: 'quote not found.' });
//         }
//         return res.status(200).json({ message: 'quote deleted successfully.' });
//     } catch (err) {
//         console.error('Error deleting quote:', err);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };