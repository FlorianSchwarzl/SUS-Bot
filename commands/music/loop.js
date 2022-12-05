module.exports = {
    name: "loop",
    description: "Loops the current queue.",
    aliases: ["repeat"],

    run(client, message, args, a, slash) {
        if (slash) message.reply("ok");
        return client.player.toggleLoop(message);
    },
};