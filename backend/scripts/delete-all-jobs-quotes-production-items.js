/**
 * Delete ALL Jobs and Quotes Script
 * DANGER: This will delete ALL jobs and quotes from the database.
 * Run with: node scripts/delete-all-jobs-quotes.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const quoteModel = require('../models/quoteModel');
const jobModel = require('../models/jobModel');
const productionJobModel = require('../models/productionJobModel');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function deleteAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Confirm before deleting
    const answer = await new Promise(resolve => {
      rl.question('WARNING: This will delete ALL jobs, quotes, and production jobs. Are you sure? (yes/no): ', resolve);
    });

    if (answer.toLowerCase() !== 'yes') {
      console.log('Operation cancelled.');
      process.exit(0);
    }

    console.log('Deleting all quotes...');
    const quotesResult = await quoteModel.deleteMany({});
    console.log(`✓ Deleted ${quotesResult.deletedCount} quotes.`);

    console.log('Deleting all jobs...');
    const jobsResult = await jobModel.deleteMany({});
    console.log(`✓ Deleted ${jobsResult.deletedCount} jobs.`);

    console.log('Deleting all production jobs...');
    const productionJobsResult = await productionJobModel.deleteMany({});
    console.log(`✓ Deleted ${productionJobsResult.deletedCount} production jobs.`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected');
    rl.close();
    process.exit(0);
  }
}

deleteAll();
