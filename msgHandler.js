const Promise = require('bluebird');

function isCommand (cmds, message) {
  if (!message.text) return false;
  const cmd = cmds(message.channel)(message.text.split(' ', 4).slice(0, 3));
  if (typeof cmd === 'function') {
    cmd(message.channel);
    return true;
  }
  return false;
}

function getLockTarget (db, origin) {
  return db.getLock(origin)
    //.tap(r => console.log(`lock exists: ${r}`));
}

module.exports = db => rtm => cmds => botID => Promise.coroutine(function* (message) {
  //console.log(`bot: ${botID}`);
  if (!message || !message.text) return;
  if (message.user === botID) return;
  if (isCommand(cmds, message)) return;

  const origin = message.channel;

  const lockTarget = yield getLockTarget(db, origin);
  const recipient = lockTarget || message.text.split(' ', 2).join(' ');
  let [[sender], [target]] = yield Promise.all([db.addUser(origin), db.getUser(recipient)]);


  if (!target) {
    [target] = yield db.getListening();
  }

if (message.subtype === 'bot_message') return;
// console.log(`user: ${message.user}
// origin: ${origin}
// target: ${target.id_slack}
// `);
//   console.log(
//     `
// message: ${JSON.stringify(message.text, 0, 2)}
// recipient: ${JSON.stringify(recipient)},
// origin: ${JSON.stringify(origin)},
// sender: ${JSON.stringify(sender)},
// target: ${JSON.stringify(target)}
// `);

  if (target && target.id_slack) {
    if (message.text.slice(0, target.silly_name.length) === target.silly_name) message.text = message.text.slice(target.silly_name.length + 1);

    rtm.sendMessage(`${sender.silly_name}\n>${message.text}`, target.id_slack);
  }
});
