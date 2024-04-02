const router = require('express').Router();
const { verifyJwt } = require('@helpers/auth');
const { checkUser } = require('@helpers/checkUser');
const { getUserPosts } = require('@services/posts');

/*
  Захист роута має будуватись так
  1. мідлвер який парсить токен
  2. мідлвер який захищяє роут - перевірка на відповідність потрібним параметрам інфи із токена
    яку розпарсив мідлвер із пункта 1 (роль, якийсь айді, і так далі...). Якщо даний юзер не має потрібних атрибутів - редірект на логін пейдж
  3. тільки тут, якщо ти перевірив що даний юзер має потрібні права - робляться всі інщі дії (лізеш в базу за контентом, наприклад)
*/
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
