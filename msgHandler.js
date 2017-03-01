const Promise = require('bluebird');


module.exports = db => rtm => cmds => Promise.coroutine(function* (message) {
  const cmd = cmds(message.channel)(message.text.split(' ', 4).slice(0, 3));

  if (cmd) return cmd(message.channel);

  const recipient = message.text.split(' ', 2).join(' ');
  const origin = message.channel;
  let [[sender], [target]] = yield Promise.all([db.addUser(origin), db.getUser(recipient)]);


  if (!target) {
    [target] = yield db.getListening();
    message.text = `    ${message.text}`;
  }

  /*console.log(
    `
recipient: ${JSON.stringify(recipient)},
origin: ${JSON.stringify(origin)},
sender: ${JSON.stringify(sender)},
target: ${JSON.stringify(target)}
`);*/

  if (target && target.id_slack) rtm.sendMessage(`${sender.silly_name}\n>${message.text.split(' ').slice(2).join(' ')}`, target.id_slack);
});
