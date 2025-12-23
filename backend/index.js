// index.js
const express = require('express');
const app = express();
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
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

connectDB();

const allowedOrigins = [
  'https://stage-bigdaddy.hackersdaddy.com',
  'http://localhost:3000'
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
app.use('/api/invoice',invoiceRoutes);
app.use('/api/invoice',invoiceRoutes);
app.use('/api/production-jobs',productionJobRoutes);

app.use('/api/auth',authRoutes);
app.use('/api/onboarding',onboardingRoutes);

app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});