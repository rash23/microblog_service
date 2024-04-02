const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function hashPassword(plainTextPass) {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(plainTextPass, salt);

  return hashedPass;
}

async function checkPassword(password, userPassword) {
  return await bcrypt.compare(password, userPassword);
}

const secret = process.env.SECRET;

function issueJwt(data) {
  return jwt.sign(data, secret, { expiresIn: '8h' });
}

function verifyJwt(token) {
  let data = {};

  if (!token) {
    return data;
  }

  try {
    data = jwt.verify(token, secret);
  } catch (err) {
    console.log(err);
  }

  return data;
}

module.exports = {
  hashPassword,
  checkPassword,
  issueJwt,
  verifyJwt,
};
