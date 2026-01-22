/**
 * Set Super Admin Script
 * Run with: node scripts/set-superadmin.js
 *
 * This script updates a user to be a Super Admin.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const usersModel = require('../models/usersModel');

// Configuration - Update this value
const USER_ID = '696fcaeacb1d0d32d698a727';

async function setSuperAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Find and update the user
    console.log(`• Updating user ${USER_ID} to Super Admin...`);

    const updatedUser = await usersModel.findByIdAndUpdate(
      USER_ID,
      { isSuperAdmin: true },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error(`User with ID "${USER_ID}" not found.`);
    }

    console.log('\n✓ User updated successfully!');
    console.log('-----------------------------------');
    console.log(`Name: ${updatedUser.name}`);
    console.log(`Email: ${updatedUser.email}`);
    console.log(`Is Super Admin: ${updatedUser.isSuperAdmin}`);
    console.log(`ID: ${updatedUser._id}`);
    console.log('-----------------------------------');

  } catch (err) {
    console.error('\n✗ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected');
  }
}

setSuperAdmin();
