module.exports = {
    name: 'clear-queue',
    description: 'Clears the track queue.',

    run(client, message, args, slash) {
        if (slash) {
            message.reply("ok");
        }

        client.player.clearQueue(message);
    }
}