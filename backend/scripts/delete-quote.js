/**
 * Delete Quote Script
 * Run with: node scripts/delete-quote.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const quoteModel = require('../models/quoteModel');

// REPLACE THIS WITH THE QUOTE ID YOU WANT TO DELETE
const QUOTE_ID = '696cdf960c0d64f745691ad5';

async function deleteQuote() {
  if (QUOTE_ID === 'REPLACE_WITH_QUOTE_ID') {
    console.error('Please set the QUOTE_ID variable in the script');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const result = await quoteModel.findByIdAndDelete(QUOTE_ID);

    if (result) {
      console.log(`✓ Quote ${QUOTE_ID} deleted successfully`);
      console.log('Deleted Quote Details:', {
        id: result._id,
        quoteId: result.quoteId, // assuming there's a friendly ID
        total: result.total
      });
    } else {
      console.error(`✗ Quote ${QUOTE_ID} not found`);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected');
  }
}

deleteQuote();
