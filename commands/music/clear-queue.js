module.exports = {
    name: "clear-queue",
    description: "Clears the song queue.",

    run(client, message, args, a, slash) {
        if (slash) {
            message.reply("ok");
        }

        client.player.clearQueue(message);
    }
}