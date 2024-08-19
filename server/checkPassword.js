const bcrypt = require('bcryptjs');

const storedHash = '$2a$10$OyiKeNPPBJkn0b9B0nUMYuWeCqsqmg7APheKlLU8M4jXaZWlHlUjK'; // Replace with actual stored hash from the database
const enteredPassword = 'test'; // Replace with the password you used during registration

bcrypt.compare(enteredPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password match:', result); // Expected output: Password match: true
  }
});
