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
const quoteRoutes = require('./routes/quoteRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const authRoutes = require('./routes/authRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');

connectDB();
app.use(cors());
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
app.use('/api/quotes',quoteRoutes);
app.use('/api/invoice',invoiceRoutes);

app.use('/api/auth',authRoutes);
app.use('/api/onboarding',onboardingRoutes);

app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});