const express = require('express');
const router = express.Router();

const { hashPassword, checkPassword } = require('../utils/auth');

//! dynamic definition of the required datastorage
const postService = require('../services/posts');
const userService = require('../services/posts');
const { protectedRoute, tokenSession } = require('../middleware/auth');

// the same error for NO USER and BAD PASSWORD - no need to give a hint WHY EXACTLY can't login
const LOGIN_ERROR = 'Invalid credentials';
const loginErrorHandler = (error, _req, resp, _next) => {
  return resp.render('login', { error });
};

// 0. index page - all posts list
router.get('/', protectedRoute(['author', 'unsigned'], '/admin'), async (req, resp, next) => {
  console.log('req._auth', req._auth);
  const { role = '', userId } = req._auth;

  const authorId = role === 'author' ? userId : -1;

  try {
    const posts = await postService.getPostsList();

    resp.render('index', { authorId, posts });
  } catch (err) {
    next('Server error, try again later');
  }
});

// 1. logout action
router.get('/auth/logout', (req, resp) => {
  // clearing user session and redirecting back to index page
  resp.clearCookie('token');
  resp.redirect('/');
});

// 2. login page
router
  .route('/auth/login')
  .get((_req, resp) => resp.render('login'))
  .post(
    express.urlencoded({ extended: false }),
    async (req, resp, next) => {
      const { login, password } = req.body;

      const admin = await userService.findAdmin(login);
      if (admin) {
        const isPassOK = await checkPassword(password, admin.password);
        if (!isPassOK) {
          return next(LOGIN_ERROR);
        }

        //!-------------------------- make Admin session
        req._auth = { role: 'admin', userId: admin.id };
        return next();
      }

      const author = await userService.findAuthor(login);
      if (!author) {
        return next(LOGIN_ERROR);
      }

      const isPassOK = await checkPassword(password, author.password);
      if (!isPassOK) {
        return next(LOGIN_ERROR);
      }

      //!-------------------------- make User (Author) session
      req._auth = { role: 'author', userId: author.id };
      next();
    },
    tokenSession,
    loginErrorHandler,
  );

// 3. register page
router
  .route('/auth/register')
  .get((_req, resp) => resp.render('register'))
  .post(
    express.urlencoded({ extended: false }),
    async (req, resp, next) => {
      const { login, password } = req.body;

      const hashedPass = await hashPassword(password);
      const newAuthor = await userService.addNewAuthor({ login, password: hashedPass });

      //!-------------------------- make User (Author) session
      req._auth = { role: 'author', userId: newAuthor.id };
      next();
    },
    tokenSession,
  );

// 4. Author home page
router.get('/author_home/:authorId', protectedRoute(['author']), async (req, resp) => {
  const { authorId } = req.params;
  const { userId } = req._auth; // comes from jwParser middleware

  if (Number(authorId) !== userId) {
    return resp.redirect('/');
  }

  const posts = await postService.getPostsList({ authorId });
  resp.render('author_home', { authorId, posts });
});

// 5. Admin home
router.get('/admin', protectedRoute(['admin']), async (req, resp) => {
  const [authors, posts] = await Promise.all([
    userService.getAuthorsList(),
    postService.getPostsList({ withAuthors: true }),
  ]);

  resp.render('admin_home', { authors, posts });
});

router.get('/*', (req, resp) => {
  resp.redirect('/');
});

module.exports = {
  router,
};
