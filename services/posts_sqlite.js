const { Model } = require('objection');

const { knex } = require('../db');
const { Author } = require('./users');
Model.knex(knex); // init objection with DB we need to work with

class Post extends Model {
  static get tableName() {
    return 'posts';
  }

  static get relationMappings() {
    return {
      author: {
        relation: Model.BelongsToOneRelation, //! one video belongs to one author
        modelClass: Author,
        join: {
          from: 'posts.author_id',
          to: 'authors.id',
        },
      },
    };
  }
}

/**
 * @param {Object} options
 * @param {number|string} [options.authorId] optionally, author id to filter by
 * @param {boolean} [options.withAuthors]
 */
function getPostsList({ authorId, withAuthors = false } = {}) {
  const query = Post.query().where(authorId ? { author_id: authorId } : {});

  if (withAuthors) {
    return query.withGraphFetched('author').modifyGraph('author', (builder) => builder.select('name'));
  }

  return query.execute();
}

function getPostById(id) {
  // SELECT * FROM videos WHERE id = X
  return Post.query().findById(id).withGraphFetched('author');
}

async function addPost(metaData) {
  // INSERT INTO videos (title, description) VALUES (metaData.title, metsData.description)
  return (await Post.query().insertAndFetch(metaData)).toJSON();
}

/**
 * @param {number|string} id
 * @returns {Promise<Number|undefined>}
 */
async function deletePostById(id) {
  // DELETE FROM videos WHERE id = X
  return (await Post.query().deleteById(id)) || undefined;
}

module.exports = {
  Post,
  addPost,
  getPostById,
  getPostsList,
  deletePostById,
};
