/**
 * Update Quote Status Script
 * Run with: node scripts/update-quote-status.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const quoteModel = require('../models/quoteModel');

const QUOTE_ID = '696d0c6166bbb12b5595bc21';
const NEW_STATUS = 'sent';

async function updateQuote() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const result = await quoteModel.findByIdAndUpdate(
      QUOTE_ID,
      { status: NEW_STATUS },
      { new: true }
    );

    if (result) {
      console.log(`✓ Quote ${QUOTE_ID} updated to '${result.status}'`);
      console.log(result);
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

updateQuote();
