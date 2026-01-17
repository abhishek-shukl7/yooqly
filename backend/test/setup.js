const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Verify required variables are loaded
const requiredVars = ['JWT', 'MONGO_URI', 'REDIS_URL'];
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable for tests: ${varName}`);
    process.exit(1);
  }
}

console.log('✅ Test environment configured successfully');
