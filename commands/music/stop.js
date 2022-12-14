module.exports = {
    name: "stop",
    description: "Stops the music and clears the queue",
    aliases: ["disconnect", "leave"],

    async run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.stop(message);
    }
}
