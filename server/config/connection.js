// config/connection.js

const { Sequelize } = require('sequelize');

// Configure your database connection here
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost', // Your database host
  username: 'ian', // Your database username
  password: '', // Your database password
  database: 'traveltots_db', // Your database name
  logging: false // Disable logging if you prefer
});

module.exports = sequelize;
