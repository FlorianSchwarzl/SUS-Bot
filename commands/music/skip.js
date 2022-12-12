module.exports = {
    name: "skip",
    description: "Skips current track",

    run: (client, message, args, a, userData, slash) => {
        if (slash) {
            slash.reply("ok");
        }
        return client.player.skip(message);                                        // call the skip function from the player
    }
}