const port = process.env.PORT || 3000;

module.exports = {
  port,
  session: {
    secret: 'my super secret string',
    cookieMaxAge: process.env.COOKIE_MAX_AGE || 60 * 60 * 1000,
  },
};
