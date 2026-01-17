// index.js
const express = require('express');
const app = express();
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');
const morgan = require('morgan');
const winston = require('winston');
const connectDB = require('./config/db');
const port = process.env.PORT || 3001;

const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jobTypeRoutes = require('./routes/jobTypeRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const productionJobRoutes = require('./routes/productionJobRoutes');

const authRoutes = require('./routes/authRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const test = require('./routes/test');

// Validate environment variables
const requiredEnvVars = ['PORT', 'MONGO_URI', 'JWT', 'REDIS_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Connect to database with proper error handling
connectDB().catch(err => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

const allowedOrigins = [
  'https://stage-bigdaddy.hackersdaddy.com',
  'http://localhost:3001'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

// Request logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use('/api/company',companyRoutes);
app.use('/api/users',userRoutes);
app.use('/api/customers',customerRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/jobType',jobTypeRoutes);
app.use('/api/quotes',quoteRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/productionJobs',productionJobRoutes);

app.use('/api/auth',authRoutes);
app.use('/api/onboarding',onboardingRoutes);

app.use('/api/test',test);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// CSRF protection (disabled for API routes, enabled for form routes)
// app.use(csurf({ cookie: true }));

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);

  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Graceful shutdown
const server = app.listen(port, '0.0.0.0', () => {
  logger.info(`Server is running on http://localhost:${port}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
