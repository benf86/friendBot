
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { id: 1, id_slack: 'G4CPHQVDJ', silly_name: 'X Team', listening: 0 },
      ]);
    });
};
