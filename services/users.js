const { Model } = require('objection');

const { knex } = require('../db');
Model.knex(knex); // init objection with DB we need to work with

class Admin extends Model {
  static get tableName() {
    return 'admin';
  }
}

class Author extends Model {
  static get tableName() {
    return 'authors';
  }

  static get relationMappings() {
    const { Video } = require('./posts_sqlite');
    return {
      videos: {
        relation: Model.HasManyRelation, //! one author has many videos
        modelClass: Video,
        join: {
          from: 'authors.id',
          to: 'videos.author_id',
        },
      },
    };
  }
}

function findAdmin(login) {
  return Admin.query().findOne({ name: login });
}

async function addNewAuthor({ login, password }) {
  return (
    await Author.query().insertAndFetch({
      name: login,
      password,
    })
  ).toJSON();
}

function findAuthor(login) {
  return Author.query().findOne({ name: login });
}

function getAuthorsList() {
  return Author.query().select('id', 'name');
}

module.exports = {
  Admin,
  Author,
  findAdmin,
  addNewAuthor,
  findAuthor,
  getAuthorsList,
};
