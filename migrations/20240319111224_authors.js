/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('authors', (table) => {
      table.increments(); // new column 'id' -> integer -> auto increment
      table.string('name').notNullable().unique();
    })
    .alterTable('posts', (table) => {
      table.integer('author_id').unsigned();
      table.foreign('author_id').references('id').inTable('authors');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('posts', (t) => {
      t.dropForeign('author_id');
      t.dropColumn('author_id');
    })
    .dropTable('authors');
};
