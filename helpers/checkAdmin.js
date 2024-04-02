const { verifyJwt } = require('./auth');

function checkAdmin(req, res, next) {
  const { token } = req.cookies;
  const user = verifyJwt(token);

  if (user.role !== 'admin') {
    return res.redirect('/login');
  }

  next();
}

module.exports = {
  checkAdmin,
};
