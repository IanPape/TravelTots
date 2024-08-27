const { Sequelize } = require('sequelize');

// Get the database URL from environment variables
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Disable logging if you prefer
});

module.exports = sequelize;
