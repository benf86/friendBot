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
  /*console.log(
    `
recipient: ${JSON.stringify(recipient)},
origin: ${JSON.stringify(origin)},
sender: ${JSON.stringify(sender)},
target: ${JSON.stringify(target)}
`);*/

  return !target || !target.id_slack
    ? rtm.sendMessage(`You are registered with the name ${sender.silly_name}`, origin)
    : rtm.sendMessage(`${sender.silly_name}\n>${message.text}`, target.id_slack);
});

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, handleMessage);

rtm.start();
