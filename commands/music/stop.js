module.exports = {
    name: "stop",
    description: "Makes the bot leave the voice channel",
    aliases: ["disconnect", "leave"],

    run: async (client, message, args, a, slash) => {
        if (slash) {
            message.reply({ content: 'ok', ephemeral: true });
        }

        client.player.stop(message);
    }
}