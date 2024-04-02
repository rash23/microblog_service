const { createPost, getUserPosts, deletePost } = require('@services/posts');
const { routerError } = require('@services/error');
const { validatePostData } = require('@middleware/validation');
const { HTTP_STATUS_CODES } = require('@utils/constants');

const express = require('express');
const router = express.Router();

router.get('/:id', getUserPosts, (req, res) => {
  res.send(HTTP_STATUS_CODES.OK_200);
});

router.post('/:id/delete', express.urlencoded({ extended: true }), deletePost, (req, res) => {
  res.redirect(req.headers.referer);
});

router.post('/add', validatePostData, createPost, (req, res) => {
  res.status(HTTP_STATUS_CODES.OK_200).send({ post_id: req.post.id });
});

router.use(routerError);

module.exports = {
  router,
};
