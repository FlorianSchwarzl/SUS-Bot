module.exports = {
    name: "pause",
    aliases: [],
    description: "Pauses the current song",

    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.pause(message);
    }
}
