# Issues

- [ ] beg can't be used without money
- [ ] When outputting time, format seconds to seconds, minutes, hours, days, ...
- [ ] When resetting balance/level the YES/NO message can be seen by everyone which would reset the balance of everyone clicking on the button
- [ ] Fix help command
- [ ] Fix coinflip: returned nothing
- [ ] Fix !numberguess:
 Number was generated! The number is: NaN
 You're number is false!
 __returned nothing__
- [ ] Fix queue: if queue is too long it could exceed the 2000 character limit imposed by discord
- [ ] deferReply() will crash the bot
- [ ] beg is currently broken
- [ ] fix bet messages, kinda ugly and overcrowded imo
- [ ] search returns nothing
- [ ] rewrite search so it used buttons instead of having to listen for messages sent by the user
- [ ] withdraw returns nothing
- [ ] can't check balance of other users
- [ ] make a leaderboard command
- [ ] coinflip returns nothing
- [ ] coinflip has no right to exist in the current state
- [ ] clear works only when deleting under 50 messages, else it times out
- [ ] all set-*-channel commands are broken as they don't work with slash commands
- [ ] tempban "guildInfo" is not defined
- [ ] unban doesn't work at all
DiscordAPIError: Invalid Form Body
message_reference: Unknown message
    at RequestHandler.execute (C:\Users\1816071\SUS-Bot\node_modules\discord.js\src\rest\RequestHandler.js:350:13)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async RequestHandler.push (C:\Users\1816071\SUS-Bot\node_modules\discord.js\src\rest\RequestHandler.js:51:14)
    at async TextChannel.send (C:\Users\1816071\SUS-Bot\node_modules\discord.js\src\structures\interfaces\TextBasedChannel.js:176:15)
    at async module.exports (C:\Users\1816071\SUS-Bot\functions\executeCommand.js:43:29) {
  method: 'post',
  path: '/channels/907009478610792519/messages',
  code: 50035,
  httpStatus: 400,
  requestData: {
    json: {
      content: "I Can't Unban That Member Maybe Member Is Not Banned Or Some Error!",
      tts: false,
      nonce: undefined,
      embeds: undefined,
      components: undefined,
      username: undefined,
      avatar_url: undefined,
      allowed_mentions: undefined,
      flags: undefined,
      message_reference: [Object],
      attachments: undefined,
      sticker_ids: undefined
    },
    files: []
  }
}
- [ ] troll returns nothing
