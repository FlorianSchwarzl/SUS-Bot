module.exports = {
    name: "loop",
    description: "Loops the current queue.",
    aliases: ["repeat"],
    connectedToSameVoiceChannel: true,

    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.toggleLoop(message);
    },
}
