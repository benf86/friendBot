exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('users', function (table) {
      table.increments('id');
      table.string('silly_name').unique();
      table.string('id_slack').unique();
      table.boolean('listening');
    }),
    knex.schema.createTableIfNotExists('locks', function (table) {
      table.increments('id');
      table.string('id_origin').unique();
      table.string('id_target');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
