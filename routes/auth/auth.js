const express = require('express');
const router = require('express').Router();
const { createUser, findUser } = require('@services/users');
const { checkAdmin } = require('@services/admin');
const { routerError } = require('@services/error');
const { validateUserData } = require('@middleware/validation');

router.post('/register', express.urlencoded({ extended: true }), validateUserData, createUser, (req, res) => {
  res.redirect('/login');
});

router.post('/login', express.urlencoded({ extended: true }), checkAdmin, findUser, (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

router.use(routerError);

module.exports = {
  router,
};
