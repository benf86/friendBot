module.exports = db => rtm => origin => command => ({
  help: () => rtm.sendMessage(`@karolsojko is this better?

So, you've come to me for help... Excellent!

I'm your friend and I have 1 job - let you communicate with your teammates and the core team anonymously.

How?

Simple. I work as your proxy and disguise names of both sides.

*messaging random people*
>If you send me a that isn't one of the commands listed below, I will forward it to a random person who has also previously interacted with me.
>\`/msg @friend Lorem Ipsum etc. etc.\`
>
>They will see it coming from your autogenerated silly name like "Doublebeak Quackkleduck" or some such.
>
>They can then reply to you, and you will only see their silly name, e.g. Bumbleears Bunnybugs.

*messaging specific people*
>If you want to message someone specific, you *must* start your message with their two-word silly name. If you want to message >Doublebeak Quackkleduck, you thus have to type:
>\`/msg @friend Doublebeak Quackkleduck Lorem Ipsum etc. etc.\`

*lock <person's silly name>*
>But since typing these names in front of every message can get old really fast, you can use the lock command. By sending me the ?message lock Doublebeak Quackkleduck, I will remember that you only want to talk to this person, and from then onwards, you do not have to type their name in front of your messages anymore.
>\`/msg @friend lock Doublebeak Quackkleduck\`
>
>If you want to lock in someone else, you can just use lock with their name.

*unlock*
>If you just want to unlock from the current partner, so you can talk to a random again, just type unlock.
>\`/msg @friend unlock\`

*getLock*
>If you want to see who your currently locked partner is, use getLock.
>\`/msg @friend getLock\`

*X Team*
>Finally, if you want to tell the core team something, but would like to remain anonymous, just use X Team as the name and type your message. I will deliver it on your behalf, every bit as anonmously as all the rest. You can also lock X Team as any other user.
>\`/msg @friend X Team Lorem Ipsum etc. etc.\`
`, origin),

  lock: () => db.lock(origin, [command[1], command[2]].join(' '))
    .then(r => rtm.sendMessage(r
      ? `You've succesfully locked on to ${r[0].id_target}`
      : `User with the handle ${[command[1], command[2]].join(' ')} does not exist`, origin)),

  unlock: () => db.unlock(origin)
  .then(r => rtm.sendMessage(r ? 'Lock succesfully removed' : 'Not locked', origin)),

  getLock: () => db.getLock(origin)
  .then(r => rtm.sendMessage(r ? `You are currently locked to ${r}` : 'Not locked', origin)),
}[command[0]]);
