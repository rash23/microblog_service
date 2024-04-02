const mongoose = require('mongoose');

const { userSchema, postsSchema, commentsSchema, adminSchema } = require('./schemas');

const User = mongoose.model('users', userSchema);
const Post = mongoose.model('posts', postsSchema);
const Comment = mongoose.model('comments', commentsSchema);
const Admin = mongoose.model('admins', adminSchema);

const mongoUrl = `mongodb+srv://${process.env.DB_MONGO_USERNAME}:${process.env.DB_MONGO_PASS}@microblog.pldv45h.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_MONGO_NAME}`;
const run = async () => {
  try {
    await mongoose.connect(mongoUrl, { dbName: process.env.DB_MONGO_NAME });

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  }
};

run();

module.exports = {
  User,
  Post,
  Comment,
  Admin,
};
