'use strict';

const config = require('./config');
const db = require('./db')();

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const bot_token = process.env.SLACK_BOT_TOKEN || config.authentication.bot_token;

const rtm = new RtmClient(bot_token);
const cmds = require('./commands')(db)(rtm);
const msgHandler = require('./msgHandler')(db)(rtm)(cmds);

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, msgHandler);

rtm.on(RTM_EVENTS.RECONNECT_URL, r => r);

rtm.start();
