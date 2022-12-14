module.exports = {
    name: "skip",
    description: "Skips current track",

    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.skip(message);                                        // call the skip function from the player
    }
}