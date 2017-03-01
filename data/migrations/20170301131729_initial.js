exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('users', function (table) {
      table.increments('id');
      table.string('silly_name');
      table.string('id_slack');
      table.boolean('listening');
    }),
    knex.schema.createTableIfNotExists('locks', function (table) {
      table.increments('id');
      table.string('id_origin');
      table.string('id_target');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
