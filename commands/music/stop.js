module.exports = {
    name: "stop",
    description: "Stops the music and clears the queue",
    aliases: ["disconnect", "leave"],

    run: async (client, message, args, a, userData, slash) => {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        }

        return client.player.stop(message);
    }
}