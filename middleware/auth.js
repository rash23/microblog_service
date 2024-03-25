const { verifyJwt, issueJwt } = require('../utils/auth');

/**
 * Demo auth middleware from old times
 * @param {*} req
 * @param {*} resp
 */
function checkAuth(req, resp) {
  const { token } = req.headers;
  if (!token || token !== 'iamuser') {
    const err = new Error('user is not authorised!');
    server.emit('authError', err, req, resp);

    return false;
  }

  return true;
}

/**
 * Parses potentially present JWT token and makes it available in Request object as req._auth for next middlewares / handlers
 * @param {import('express').Request} req
 * @param {import('express').Response} resp
 * @param {import('express').NextFunction} next
 */
function jwtParser(req, resp, next) {
  const { token = '' } = req.cookies;
  const payload = verifyJwt(token);

  req._auth = payload;
  next();
}

/**
 * @param {string[]} allowedRoles
 * @param {string} redirectTo
 * @returns {(
 *  req: import('express').Request & { _auth: { role: string, userId: number } },
 *  resp: import('express').Response,
 *  next: import('express').NextFunction
 * ) => void}
 */
const protectedRoute = (allowedRoles = [], redirectTo = '/auth/login') =>
  function (req, resp, next) {
    const { role = 'unsigned' } = req._auth || {};

    if (!allowedRoles.includes(role)) {
      return resp.redirect(redirectTo);
    }

    next();
  };

/**
 * @param {import('express').Request & { _auth: { role: string, userId: number } }} req
 * @param {import('express').Response} resp
 * @returns
 */
function tokenSession(req, resp) {
  const { userId, role } = req._auth || {};
  if (!role || !userId) {
    return next('Authorizarion error');
  }

  const token = issueJwt({ userId, role });

  resp.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

  const redirectTo = role === 'admin' ? '/admin' : '/';
  return resp.redirect(redirectTo);
}

module.exports = {
  checkAuth,
  jwtParser,
  protectedRoute,
  tokenSession,
};
