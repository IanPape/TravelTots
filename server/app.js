require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Logging middleware to check request body
app.use((req, res, next) => {
  console.log('Request body before parsing:', req.rawBody);
  console.log('Request body after parsing:', req.body);
  next();
});

// Use user routes
app.use('/api', userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
