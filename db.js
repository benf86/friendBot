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

function unlock (origin) {
  return knex('locks').where({ id_origin: origin }).delete();
}

function lock (origin, target) {
  return unlock(origin)
    .then(r => knex('locks').insert({ id_origin: origin, id_target: target }))
    .then(r => knex('locks').where({ id_origin: origin, id_target: target }));
}



module.exports = () => ({
  addUser,
  getUser,
  getListening,
  lock,
  unlock,
});
