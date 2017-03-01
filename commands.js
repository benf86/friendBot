module.exports = rtm => origin => command => ({
  help: () => rtm.sendMessage(`How to use me? Easy!

If you just type a message, I will forward it to a random person, who's listening - this might even be you. If this happens, just try again. When they answer, you will see their answer as coming from a certain two-word name. In the future, when you want to message them, just make sure the first two words of your message are that two-word name, e.g. \`Totallyawesome Cuddlepanda Lorem Ipsum you know how this goes\`, and it will be delivered to them. If you skip the name, it will go to another randomly chosen person.

That's it! There is no logging, and the database contains no data that can personally identify you without some seriously annoying research, which nobody is going to be doing, so feel free to be honest. You can see my brainz here, to make sure: https://github.com/benf86/friendBot
`, origin),

  lock: () => console.log(`locking ${origin}`),
  unlock: () => console.log(`unlocking ${origin}`),
}[command]);
