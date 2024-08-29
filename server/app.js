require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { Folder, Playground } = require('./models');

const app = express();

// Middleware

// Enable CORS for all routes and origins
app.use(cors({
  origin: 'https://traveltots.onrender.com', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  credentials: true // Necessary if you're dealing with cookies or authentication
}));

// Additional CORS headers in case iOS requires them
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://traveltots.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight requests for CORS
  }
  next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

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