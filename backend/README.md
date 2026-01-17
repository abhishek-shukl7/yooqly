# CRM Backend Application

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the application
npm start

# For development with auto-restart
npm run dev
```

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch
```

### E2E Tests
```bash
# Run Cypress tests
npm run test:cypress

# Run all tests (unit + e2e)
npm run test:all
```

## 🔒 Security Features Implemented

### 1. **Rate Limiting**
- Limits API requests to 100 per 15 minutes per IP
- Prevents brute force attacks and API abuse
- Configurable window and limit settings

### 2. **Helmet Security Headers**
- Adds multiple security headers to protect against common web vulnerabilities
- Includes Content Security Policy, XSS protection, and more

### 3. **CSRF Protection**
- CSRF tokens for form submissions
- Automatic token validation
- Configurable cookie-based protection

### 4. **Environment Validation**
- Validates required environment variables on startup
- Prevents application from starting with missing configuration
- Required variables: `PORT`, `MONGO_URI`, `JWT`, `REDIS_URL`

## 🛡️ Enhanced Security

### **JWT Authentication**
- Secure token generation and validation
- 24-hour expiration with refresh capability
- Redis-backed session caching

### **Input Validation**
- Express-validator integration for all endpoints
- Comprehensive validation for user input
- Custom error messages for validation failures

### **CORS Configuration**
- Strict origin whitelisting
- Credential support for authenticated requests
- Configurable allowed methods

## 🔧 Performance Optimizations

### **Database Indexes**
- Added comprehensive indexes to User model
- Compound indexes for frequently queried fields
- Automatic index creation on startup

### **API Response Caching**
- Redis-based caching middleware
- Configurable TTL (default: 60 seconds)
- Cache invalidation utilities
- Automatic cache key generation

### **Connection Management**
- MongoDB connection pooling
- Redis connection management
- Graceful shutdown handling

## 📊 Monitoring & Logging

### **Winston Logging**
- Structured JSON logging
- File-based log rotation
- Error-specific logging
- Request logging with Morgan

### **Health Check Endpoint**
- `/health` endpoint for monitoring
- Returns system status and uptime
- Useful for load balancers and monitoring tools

## 🧩 Code Quality Improvements

### **Error Handling**
- Global error handling middleware
- Proper error classification
- Structured error responses
- Development vs production error details

### **Graceful Shutdown**
- SIGTERM and SIGINT handling
- Proper connection cleanup
- Uncaught exception handling
- Unhandled rejection tracking

### **Configuration Management**
- Environment variable validation
- Deprecated option removal
- Proper timeout configurations

## 📂 Project Structure

```
backend/
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middlewares/         # Express middlewares
├── models/              # Mongoose models
├── routes/              # API routes
├── services/            # Business logic
├── test/                # Unit tests
├── utils/               # Utility functions
├── cypress/             # E2E tests
├── index.js             # Main application entry
├── package.json         # Dependencies and scripts
└── README.md            # Documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/crm
JWT=your_strong_jwt_secret_here
REDIS_URL=redis://localhost:6379
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_email_password
MAIL_FROM_ADDRESS=no-reply@example.com
MAIL_FROM_NAME=Your Company
```

### CORS Configuration

Update allowed origins in `index.js`:

```javascript
const allowedOrigins = [
  'https://your-production-domain.com',
  'http://localhost:3000'
];
```

## 🚀 Deployment

### Production Setup

```bash
# Build and start
npm install --production
npm start
```

### With PM2 (recommended)

```bash
npm install -g pm2
pm2 start index.js --name crm-backend
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📋 API Documentation

### Health Check
```
GET /health
```
Returns system health status

### Authentication
```
POST /api/auth/login
```
Authenticates users and returns JWT token

### Companies
```
GET /api/company/getCompany/:id
```
Get company details (cached for 5 minutes)

## 🔄 CI/CD Pipeline

### Example GitHub Actions Workflow

```yaml
name: CRM Backend CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '20'
    - run: npm install
    - run: npm test
    - run: npm run test:cypress

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '20'
    - run: npm install --production
    - run: pm2 restart crm-backend
```

## 🛠 Maintenance

### Security Audits
```bash
npm audit
npm audit fix
```

### Dependency Updates
```bash
npm outdated
npm update
```

### Log Rotation
Configure logrotate for production logs:
```
/path/to/backend/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 640 root root
}
```

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure proper network connectivity

2. **Redis Connection Errors**
   - Verify Redis server is running
   - Check `REDIS_URL` in `.env`
   - Test connection with `redis-cli`

3. **Rate Limiting Issues**
   - Check if you're hitting the limit (100 requests/15 minutes)
   - Adjust limits in `index.js` if needed
   - Consider whitelisting trusted IPs

4. **CORS Issues**
   - Ensure your frontend URL is in the allowed origins list
   - Check for proper credential handling
   - Verify no mixed content issues (HTTP vs HTTPS)

## 📞 Support

For issues and questions, please refer to the project documentation or contact the development team.
