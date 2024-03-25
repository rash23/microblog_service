const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function hashPassword(plainTextPass) {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(plainTextPass, salt);

  return hashedPass;
}

async function checkPassword(plainTextPass, hashedPass) {
  try {
    return !!(await bcrypt.compare(plainTextPass, hashedPass));
  } catch (err) {
    return false;
  }
}

// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQi....
const secret = 'my super secret JWT string key';
function issueJwt(dataToSign) {
  return jwt.sign(dataToSign, secret, { expiresIn: '2h' });
}

function verifyJwt(token) {
  let data = {};
  if (!token) {
    return data;
  }

  try {
    data = jwt.verify(token, secret);
  } catch (err) {}

  return data;
}

module.exports = {
  hashPassword,
  checkPassword,
  issueJwt,
  verifyJwt,
};
