const bcrypt = require('bcryptjs');

// Function to hash a password
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    throw new Error('Error hashing password');
  }
};

module.exports = hashPassword ;
