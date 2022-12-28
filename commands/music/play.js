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
        try { message.suppressEmbeds(true); } catch (e) { }
        return client.player.addTrack(message, args);
    }
}
