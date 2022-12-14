module.exports = {
    name: "loop",
    description: "Loops the current queue.",
    aliases: ["repeat"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.toggleLoop(message);
    },
}
