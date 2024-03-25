const router = require('express').Router();

const { postValidator } = require('../middleware/post_validator');

const PostController = require('../controllers/posts');

const postService = require('../services/posts');

const postController = new PostController(postService);

// main API routes
router.get('/', postController.getPostsList.bind(postController));

router.get('/:postId', postController.getPostById.bind(postController));

router.post('/', postValidator, postController.addPost.bind(postController));

router.delete('/:postId', postController.deletePostById.bind(postController));

// errors
router.use(handleUnexpectedErros);

function handleUnexpectedErros(err, _req, resp) {
  resp.send(500, { error: err.message });
}

module.exports = {
  router,
};
