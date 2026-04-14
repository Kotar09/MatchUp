const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/swipes', require('./routes/swipeRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
module.exports = app;