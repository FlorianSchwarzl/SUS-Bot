module.exports = {
    name: "skip",
    description: "Skips current track",

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
            message.reply("ok");
        }
        return client.player.skip(message);                                        // call the skip function from the player
    }
}