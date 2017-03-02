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

function getListening (origin) {
  return knex.raw('select * from users where id_slack <> ? order by RANDOM() limit 1', origin);
}

function unlock (origin) {
  return knex('locks').where({ id_origin: origin }).delete();
}

function lock (origin, target) {
  return getUser(target)
    .then(r => r.length ? unlock(origin) : null)
    .then(r => r === null ? null : knex('locks').insert({ id_origin: origin, id_target: target }))
    .then(r => r === null ? null : knex('locks').where({ id_origin: origin, id_target: target }));
}

function getLock (origin) {
  return knex('locks').where({ id_origin: origin }).select('id_target')
    .then(r => r[0] ? r[0].id_target : null);
}



module.exports = () => ({
  addUser,
  getUser,
  getListening,
  lock,
  unlock,
  getLock,
});
