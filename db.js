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
        listening: true,
      })
      .then(r => knex('users').where({ id: r[0] }))));
}

function getListening () {
  return knex.raw('select * from users order by RANDOM() limit 1');
}

module.exports = () => ({
  addUser,
  getUser,
  getListening,
});
