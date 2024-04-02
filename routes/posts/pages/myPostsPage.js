const router = require('express').Router();
const { verifyJwt } = require('@helpers/auth');
const { checkUser } = require('@helpers/checkUser');
const { getUserPosts } = require('@services/posts');

router.get('/:id', checkUser, getUserPosts, async (req, res) => {
  const posts = req.posts;
  const { token } = req.cookies;
  const user = verifyJwt(token);

  try {
    res.render('my_posts', { posts, user });
  } catch (err) {
    next(err);
  }
});

module.exports = {
  router,
};
