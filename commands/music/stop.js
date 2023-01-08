module.exports = {
    description: "Stops the music and clears the queue",
    aliases: ["disconnect", "leave"],
    connectedToSameVoiceChannel: true,

    async run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.stop(message);
    }
}
