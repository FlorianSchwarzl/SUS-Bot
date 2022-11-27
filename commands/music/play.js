module.exports = {
    name: 'play',
    description: "Play or Queue a new video",

    options: [
        {
            name: "query",
            type: "STRING",
            description: "link / name of track to play",
            required: true
        }
    ],

    async run(client, message, args, interaction) {
        if (interaction) {                                                  // if the command was sent as a slash command
            message.reply("ok");                                            // send a reply to the interaction
            message.channel = client.channels.cache.get(message.channelId); // and set the channel to the channel the interaction was sent in
        }

        client.player.addTrack(client, message, args);                      // call the addTrack function from the player
    }
}