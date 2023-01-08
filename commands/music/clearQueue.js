module.exports = {
    description: "Clears the song queue.",
    connectedToSameVoiceChannel: true,

    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.clearQueue(message);
    }
}
