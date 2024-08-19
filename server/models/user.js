const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });

  // Hash password before saving the user
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password.trim(), 10);
      console.log('Hashed password in beforeCreate:', user.password);
    }
  });

  return User;
};
