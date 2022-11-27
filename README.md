# SUS-Bot

SUS-Bot is a Bot we made for our Discord Server "Stupid Useless Server" (SUS). It is written in JavaScript and uses the Discord.js Library. Any help is appreciated. Just make a Pull Request and we will check it out.

## How to use

### Self Hosting

1. Clone the Repository
2. Create the `.env` file and fill it with the following content:

```env
TOKEN= # Your Discord Bot Token
PREFIX= # The Prefix you want to use. For example: !
```

3. Open CMD
4. Navigate to the Repository
5. Install the Dependencies with `npm i`
6. Run the Bot with `node .`
7. Enjoy

### Invite the Bot

Disclaimer! The Bot is currently under heavy development so it might not be online all the time.

1. Go to the [Invite Page](https://discord.com/api/oauth2/authorize?client_id=1043594673614225429&permissions=8&scope=bot)
2. Select your Server
3. Grant the Permissions
4. Enjoy

P.S. If you want to invite the Bot to your Server, you need to have the `Manage Server` Permission.

P.P.S. The prefix for the hosted Version is `!`

## Commands

`###` means coming soon!
`%%%` means WIP!

### General

- %%%`help` - Shows the Help Page
- `ping` - Shows the Ping of the Bot
- `invite` - Creates an Invite Link for the Server
- `inviteBot` - Shows the Invite Link for the Bot
- `info` - Shows some Information about the Bot

### Moderation

- ###`kick` - Kicks a Member
- ###`tempban` - Temporarily Bans a Member
- ###`unban` - Unbans a Member
- ###`mute` - Mutes a Member
- ###`tempmute` - Temporarily Mutes a Member
- ###`unmute` - Unmutes a Member
- `clear` - Deletes a certain amount of Messages
- ###`slowmode` - Sets the Slowmode of a Channel
- ###`lock` - Locks a Channel
- ###`unlock` - Unlocks a Channel
- ###`warn` - Warns a Member
- ###`warnings` - Shows the Warnings of a Member
- ###`removewarning` - Removes a Warning from a Member
- ###`resetwarnings` - Resets the Warnings of a Member

### Music

- `play` - Plays a Song
- `skip` - Skips the current Song
- `stop` - Stops the Music
- `leave` - Leaves the Voice Channel
- `queue` - Shows the Queue
- `nowPlaying` - Shows the current Song
- ###`pause` - Pauses the Music
- ###`resume` - Resumes the Music
- ###`loop` - Loops the Queue
- `shuffle` - Shuffles the Queue
