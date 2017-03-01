'use strict';

const Promise = require('bluebird');
const config = require('./config');

const db = require('./db')();

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const bot_token = process.env.SLACK_BOT_TOKEN || config.authentication.bot_token;

const rtm = new RtmClient(bot_token);

const handleMessage = Promise.coroutine(function* (message) {
  const recipient = message.text.split(' ', 2).join(' ');
  const origin = message.channel;
  let [[sender], [target]] = yield Promise.all([db.addUser(origin), db.getUser(recipient)]);

  if (message.text === 'help') {
    return rtm.sendMessage(`How to use me? Easy!
If you just type a message, I will forward it to a random person, who's listening - this might even be you. If this happens, just try again. When they answer, you will see their answer as coming from a certain two-word name. In the future, when you want to message them, just make sure the first two words of your message are that two-word name, e.g. \`Totallyawesome Cuddlepanda Lorem Ipsum you know how this goes\`, and it will be delivered to them. If you skip the name, it will go to another randomly chosen person.

That's it! There is no logging, and the database contains no data that can personally identify you without some seriously annoying research, which nobody is going to be doing, so feel free to be honest. You can see my brainz here, to make sure: https://github.com/benf86/friendBot
`, origin);
  }

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

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, handleMessage);

rtm.start();
