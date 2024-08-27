require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { Folder, Playground } = require('./models');

const app = express();

// Middleware

// Enable CORS for all routes and origins
// In production, you might want to restrict this to specific origins for security reasons
app.use(cors({
  origin: 'https://traveltots.onrender.com', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true // If you're dealing with cookies or authentication, this might be necessary
}));

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
