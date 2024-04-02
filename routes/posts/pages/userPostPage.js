const router = require('express').Router();
const { getPostById } = require('@services/posts');
const { getCommentsById } = require('@services/comments');
const { verifyJwt } = require('@helpers/auth');

router.get('/:id', getPostById, getCommentsById, async (req, res) => {
  try {
    const post = req.post;
    const comments = req.comments;
    const { token } = req.cookies;
    const user = verifyJwt(token);

    res.render('post', { post, comments, user });
  } catch (err) {
    next(err);
  }
});

module.exports = {
  router,
};
