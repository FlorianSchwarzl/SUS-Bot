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

    async run(client, message, args, slash) {
        if (slash) {
            message.reply("ok");
        }

        client.player.addTrack(message, args);                      // call the addTrack function from the player
    }
}