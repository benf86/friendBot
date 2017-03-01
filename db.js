const sillyName = require('sillyname');
const config = require('./config');
const knex = require('knex')(config.db);

function getUser (id) {
  return knex('users')
    .where({ id_slack: id })
    .orWhere({ silly_name: id });
}

function addUser (id) {
  return getUser(id)
    .then(r => (r.length
      ? r
      : knex('users').insert({
        id_slack: id,
        silly_name: sillyName(),
      })
      .then(r => knex('users').where({ id: r[0] }))));
}

module.exports = () => ({
  addUser,
  getUser,
});
