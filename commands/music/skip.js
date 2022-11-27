module.exports = {
    name: "skip",
    description: "skip current track",

    run: (client, message, args, slash) => {
        if (slash) {                                                        // if the command was sent as a slash command
            slash.reply("ok");                                              // send a reply to the interaction
            message.channel = client.channels.cache.get(message.channelId); // set the channel to the channel the interaction was sent in
        }
        client.player.skip(message);                                        // call the skip function from the player
    }
}