// index.js
const express = require('express');
const app = express();
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');
const driverRoutes = require('./routes/driverRoutes');
const mapRoutes = require('./routes/mapRoutes');
const  { initializeSocket } = require('./socket');


connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);
initializeSocket(server);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use('/api/users',userRoutes);
app.use('/api/rides',rideRoutes);
app.use('/api/driver',driverRoutes);
app.use('/api/map',mapRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});