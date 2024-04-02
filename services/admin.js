const { Admin } = require('@db/mongo');
const { checkPassword, issueJwt } = require('@helpers/auth');
const { HTTP_STATUS_CODES } = require('@utils/constants');
const { logger } = require('@utils/logger');

async function checkAdmin(req, res, next) {
  const { password, email } = req.body;
  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      logger.info('Admin not found');
      next();
      return;
    }

    const passwordMatch = await checkPassword(password, admin.password);
    if (!passwordMatch) {
      logger.warn('Incorrect password for admin');
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED_401).send('Password error');
    }

    const token = issueJwt({ id: admin.id, role: 'admin' });
    res.cookie('token', token, { httpOnly: true });

    res.redirect('/admin');
  } catch (err) {
    logger.error(`Error in checkAdmin middleware: ${err.message}`);
    next(err);
  }
}

module.exports = {
  checkAdmin,
};
