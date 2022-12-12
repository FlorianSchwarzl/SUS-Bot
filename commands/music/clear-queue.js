module.exports = {
    name: "clear-queue",
    description: "Clears the song queue.",

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
            message.reply("ok");
        }

        return client.player.clearQueue(message);
    }
}