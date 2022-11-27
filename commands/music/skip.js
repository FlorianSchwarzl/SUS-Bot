module.exports = {
    name: "skip",
    description: "skip current track",

    run: (client, message, args, slash) => {
        if(slash) {
            slash.reply("ok");
            message.channel = client.channels.cache.get(message.channelId);
        }
        client.player.skip(client, message);
    }
}