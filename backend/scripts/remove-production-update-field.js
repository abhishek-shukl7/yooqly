/**
 * Migration Script: Remove deprecated productionUpdate field from emailSettings
 *
 * This script removes the `productionUpdate` field from the `emailSettings`
 * subdocument in all Company documents.
 *
 * Usage: node scripts/remove-production-update-field.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

async function migrate() {
  console.log('Connecting to MongoDB...');

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const db = mongoose.connection.db;
    const companiesCollection = db.collection('companies');

    // Find documents that have the deprecated field
    const countBefore = await companiesCollection.countDocuments({
      'emailSettings.productionUpdate': { $exists: true }
    });

    console.log(`Found ${countBefore} companies with the deprecated 'productionUpdate' field.`);

    if (countBefore === 0) {
      console.log('No migration needed. Exiting.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Remove the field from all documents
    const result = await companiesCollection.updateMany(
      { 'emailSettings.productionUpdate': { $exists: true } },
      { $unset: { 'emailSettings.productionUpdate': '' } }
    );

    console.log(`Successfully updated ${result.modifiedCount} company documents.`);
    console.log('Migration complete!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrate();
