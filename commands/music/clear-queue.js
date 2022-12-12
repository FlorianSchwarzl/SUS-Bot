module.exports = {
    name: "clear-queue",
    description: "Clears the song queue.",

    run(client, message, args, a, userData, slash) {
        if (slash) {
            message.reply("ok");
        }

        return client.player.clearQueue(message);
    }
}