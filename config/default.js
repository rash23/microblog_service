module.exports = {
  server: {
    port: process.env.PORT || 3000
  },
  jwt: {
    secret: process.env.SECRET || 'my-super-secret-phrase',
    expiresIn: process.env.JWT_EXP || '8h'
  },
  db: {
    user: process.env.DB_MONGO_USERNAME,
    pass: process.env.DB_MONGO_PASS,
    host: 'microblog.pldv45h.mongodb.net', // put it to your env too
    dbName: process.env.DB_MONGO_NAME
  },
  isProduction: process.env.NODE_ENV === 'production'
}