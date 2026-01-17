const mongoose = require("mongoose");
const winston = require("winston");

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'mongo-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'mongo-combined.log' })
  ]
});

async function connectDB() {
  try {
    // Remove deprecated options - they're no longer needed in modern Mongoose
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000
    });

    logger.info('MongoDB Connected');

    // Add event listeners for connection events
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection established');
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB connection reconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    // Create indexes for all models
    await createIndexes();

  } catch (err) {
    logger.error('MongoDB connection failed:', err);
    throw err; // Re-throw to be handled by caller
  }
}

async function createIndexes() {
  try {
    // Get all models and create indexes
    const models = mongoose.modelNames();
    for (const modelName of models) {
      const model = mongoose.model(modelName);
      await model.createIndexes();
      logger.info(`Indexes created for model: ${modelName}`);
    }
  } catch (err) {
    logger.error('Error creating indexes:', err);
  }
}

module.exports = connectDB;
