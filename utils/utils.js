const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateToken(userId, email) {
  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
  return token;
}

async function getHashedpassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}


async function verifyPassword(password, hashedPassword) {

  const isValidPassword = await bcrypt.compare(password, hashedPassword);

  if (isValidPassword) {
    return true
  }
  return false;
}

module.exports = { generateToken, getHashedpassword, verifyPassword }
