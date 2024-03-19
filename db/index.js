const { session: sessionConfig } = require('config');
const knexLib = require('knex');

// initializing generic connection to our DB
const knex = knexLib(require('../knexfile'));

// user sessions
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const store = new KnexSessionStore({ knex });
const sessionMiddleware = session({
  secret: sessionConfig.secret,
  store,
  saveUninitialized: false, // no need to keep empty unauth sessions in the db
  resave: true,
  cookie: {
    maxAge: sessionConfig.cookieMaxAge,
  },
});

module.exports = {
  knex,
  sessionMiddleware,
};
