/**
 * Delete Production Job by ID Script
 * Run with: node scripts/delete-production-item.js <ID>
 */
require('dotenv').config();
const mongoose = require('mongoose');
const productionJobModel = require('../models/productionJobModel');

const ID = process.argv[2];

if (!ID) {
  console.error('Please provide a Production Job ID as an argument.');
  console.error('Usage: node scripts/delete-production-item.js <ID>');
  process.exit(1);
}

async function deleteProductionJob() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const result = await productionJobModel.findByIdAndDelete(ID);

    if (result) {
      console.log(`✓ Production Job ${ID} deleted successfully`);
    } else {
      console.error(`✗ Production Job ${ID} not found`);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected');
  }
}

deleteProductionJob();
