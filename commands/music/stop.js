module.exports = {
    name: "stop",
    description: "Stops the music and clears the queue",
    aliases: ["disconnect", "leave"],

    async run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
            message.reply({ content: "ok", ephemeral: true });
        }

        return client.player.stop(message);
    }
}