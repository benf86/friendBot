'use strict';

const config = require('./config');
const db = require('./db')();

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const bot_token = process.env.SLACK_BOT_TOKEN || config.authentication.bot_token;

const rtm = new RtmClient(bot_token);
const cmds = require('./commands')(db)(rtm);
const MsgHandler = require('./msgHandler')(db)(rtm)(cmds);


rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  const msgHandler = MsgHandler(rtmStartData.self.id);
  rtm.on(RTM_EVENTS.MESSAGE, msgHandler);
});

process.on('SIGINT', function () {
  rtm.disconnect();
  process.exit();
});


rtm.start();
