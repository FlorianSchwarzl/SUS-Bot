module.exports = {
    name: "stop",
    descrition: "make the bot leave the voice channel",
    aliases: ["disconnect", "leave"],

    run: async (client, message, args, slash) => {
        if (slash) {
            message.reply({ content: 'ok', ephemeral: true });
        }

        client.player.stop(message);
    }
}