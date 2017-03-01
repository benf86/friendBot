const Promise = require('bluebird');

function isCommand (cmds, message) {
  const cmd = cmds(message.channel)(message.text.split(' ', 4).slice(0, 3));
  if (cmd) {
    cmd(message.channel);
    return true;
  }
  return false;
}

function getLockTarget (db, origin) {
  return db.getLock(origin)
    .tap(r => console.log(`lock exists: ${r}`))
    .then(r => r);
}

module.exports = db => rtm => cmds => Promise.coroutine(function* (message) {
  if (isCommand(cmds, message)) return;

  const origin = message.channel;
  const recipient = (yield getLockTarget(db, origin)) || message.text.split(' ', 2).join(' ');
  let [[sender], [target]] = yield Promise.all([db.addUser(origin), db.getUser(recipient)]);

  if (!target) {
    [target] = yield db.getListening();
    message.text = `    ${message.text}`;
  }

  console.log(
    `
message: ${JSON.stringify(message, 0, 2)}
recipient: ${JSON.stringify(recipient)},
origin: ${JSON.stringify(origin)},
sender: ${JSON.stringify(sender)},
target: ${JSON.stringify(target)}
`);

  if (target && target.id_slack) rtm.sendMessage(`${sender.silly_name}\n>${message.text.split(' ').slice(2).join(' ')}`, target.id_slack);
});
