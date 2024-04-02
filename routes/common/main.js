const { verifyJwt } = require('@helpers/auth');
const { getPosts } = require('@services/posts');

const router = require('express').Router();

router.get('/', getPosts, async (req, res) => {
  try {
    const posts = req.posts;
    const { token } = req.cookies;
    const user = verifyJwt(token);

    res.render('main', { posts, user });
  } catch (err) {
    next(err);
  }
});

module.exports = {
  router,
};
