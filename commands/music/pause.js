module.exports = {
    name: "pause",
    aliases: [],
    description: "Pauses the current song",

    run(client, message, args, a, slash) {
        if (slash) message.reply("ok");
        return client.player.pause(message);
    }
}