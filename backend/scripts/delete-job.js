/**
 * Delete Job by ID Script
 * Run with: node scripts/delete-job.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const jobModel = require('../models/jobModel');

const JOB_ID = '696cbf883b89bb5b31bf5a1c';

async function deleteJob() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const result = await jobModel.findByIdAndDelete(JOB_ID);

    if (result) {
      console.log(`✓ Job ${JOB_ID} deleted successfully`);
    } else {
      console.error(`✗ Job ${JOB_ID} not found`);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected');
  }
}

deleteJob();
