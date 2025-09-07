const { validationResult } = require("express-validator");
const invoiceModel = require("../models/invoiceModel");
const invoiceService = require("../services/invoiceService");

module.exports.getInvoice = async (req,res,next) => {
    try {
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'invoice not found.' });
        }
        return res.status(200).json({ invoice });
    } catch (err) {
        console.error('Error fetching invoice by ID:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.createInvoice = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    const { customerId ,quoteId,invoiceDate,dueDate,status,invoiceTotal} = req.body;
    const invoice = await invoiceService.createInvoice({
        companyId : companyId,
        customerId : customerId,
        quoteId: quoteId,
        userId: userId,
        invoiceDate: invoiceDate,
        dueDate: dueDate,
        status: status,
        invoiceTotal: invoiceTotal
    });

    return res.status(200).json({invoice: invoice});
}


module.exports.updateInvoice = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    try {
        const updatedInvoice = await invoiceService.updateInvoice(req.params.id, req.body);
        if (!updatedInvoice) {
            return res.status(404).json({ message: 'invoice not found.' });
        }
        return res.status(200).json({ invoice: updatedInvoice });
    } catch (err) {
        console.error('Error updating invoice:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService.getAllInvoices();
        return res.status(200).json({ invoices });
    } catch (err) {
        console.error('Error fetching all invoices:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// module.exports.deleteInvoice = async (req, res) => {
//     try {
//         const deletedInvoice = await InvoiceService.deleteInvoice(req.params.id);
//         if (!deletedInvoice) {
//             return res.status(404).json({ message: 'invoice not found.' });
//         }
//         return res.status(200).json({ message: 'invoice deleted successfully.' });
//     } catch (err) {
//         console.error('Error deleting invoice:', err);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };