/**
 * Create New User Script
 * Run with: node scripts/create-user.js
 *
 * This script creates a new user in the database.
 * It will automatically assign the user to the first available company if no COMPANY_ID is provided.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const usersModel = require('../models/usersModel');
const companyModel = require('../models/companyModel');

// Configuration - Update these values
const USER_NAME = 'Sandeep Reddy';
const USER_EMAIL = 'hackersdaddy420@gmail.com';
const USER_PASSWORD = 'Hackersdaddy#10';
const USER_ROLES = ['admin']; // Options: 'production', 'admin'
const IS_SUPER_ADMIN = true; // Set to true for super admin
const COMPANY_ID = '6965225db15cfea7709b7c18'; // Optional: Leave empty to use the first found company

async function createUser() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // 1. Resolve Company ID
    let companyId = COMPANY_ID;
    if (!companyId) {
      console.log('• No COMPANY_ID provided, fetching the first available company...');
      const company = await companyModel.findOne();
      if (!company) {
        throw new Error('No companies found in the database. Please create a company first.');
      }
      companyId = company._id;
      console.log(`✓ Found Company: ${company.companyName} (${companyId})`);
    }

    // 2. Check if user already exists
    const existingUser = await usersModel.findOne({ email: USER_EMAIL });
    if (existingUser) {
      throw new Error(`User with email "${USER_EMAIL}" already exists.`);
    }

    // 3. Hash Password
    console.log('• Hashing password...');
    const passwordHash = await usersModel.hashPwd(USER_PASSWORD);

    // 4. Create User
    console.log('• Creating user...');
    const newUser = new usersModel({
      companyId: companyId,
      name: USER_NAME,
      email: USER_EMAIL,
      role: USER_ROLES,
      passwordHash: passwordHash,
      isSuperAdmin: IS_SUPER_ADMIN,
      isActive: true,
      lastLogin: null
    });

    const savedUser = await newUser.save();

    console.log('\n✓ User created successfully!');
    console.log('-----------------------------------');
    console.log(`Name: ${savedUser.name}`);
    console.log(`Email: ${savedUser.email}`);
    console.log(`Roles: ${savedUser.role.join(', ')}`);
    console.log(`Company ID: ${savedUser.companyId}`);
    console.log(`ID: ${savedUser._id}`);
    console.log('-----------------------------------');

  } catch (err) {
    console.error('\n✗ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected');
  }
}

createUser();
