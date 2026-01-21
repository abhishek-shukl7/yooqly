/**
 * Reset User Password Script
 * Run with: node scripts/reset-password.js
 *
 * This script resets a user's password by email
 */
require('dotenv').config();
const mongoose = require('mongoose');
const usersModel = require('../models/usersModel');

// Configuration - Update these values
const USER_EMAIL = 'abhishekshukla12897@gmail.com';
const NEW_PASSWORD = 'abhishek@123';

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Find the user by email
    const user = await usersModel.findOne({ email: USER_EMAIL });

    if (!user) {
      console.error(`✗ User with email "${USER_EMAIL}" not found`);
      return;
    }

    console.log(`✓ Found user: ${user.name} (${user.email})`);

    // Hash the new password
    const passwordHash = await usersModel.hashPwd(NEW_PASSWORD);

    // Update the user's password
    const result = await usersModel.findByIdAndUpdate(
      user._id,
      { passwordHash },
      { new: true }
    );

    if (result) {
      console.log(`✓ Password reset successfully for ${result.email}`);
      console.log('  New password set. User can now log in.');
    } else {
      console.error('✗ Failed to update password');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected');
  }
}

resetPassword();
