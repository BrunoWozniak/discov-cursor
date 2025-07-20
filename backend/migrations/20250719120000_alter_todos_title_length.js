// backend/migrations/20250719120000_alter_todos_title_length.js
exports.up = function(knex) {
  return knex.schema.alterTable('todos', function(table) {
    table.string('title', 140).notNullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('todos', function(table) {
    table.string('title', 80).notNullable().alter();
  });
}; 