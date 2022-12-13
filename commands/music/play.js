module.exports = {
    name: "play",
    description: "Adds a song to the queue",

    options: [
        {
            name: "query",
            type: "STRING",
            description: "Link/Name of track to play",
            required: true
        }
    ],

    async run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
            message.reply("ok");
        }

        return client.player.addTrack(message, args);
    }
}