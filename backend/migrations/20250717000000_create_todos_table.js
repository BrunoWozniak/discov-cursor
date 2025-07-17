// backend/migrations/20230717100000_create_todos_table.js
exports.up = function(knex) {
    return knex.schema.createTable('todos', function(table) {
      table.increments('id').primary();
      table.string('title', 80).notNullable();
      table.boolean('completed').notNullable().defaultTo(false);
      // Add other columns as needed
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('todos');
  };