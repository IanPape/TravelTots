// config/connection.js

const { Sequelize } = require('sequelize');

// Use your Supabase database connection string
const sequelize = new Sequelize('postgresql://postgres:traveltots_dbpassword!@aws-0-us-east-2.pooler.supabase.com:6543/postgres', {
  dialect: 'postgres',
  logging: false // Disable logging if you prefer
});

module.exports = sequelize;
