module.exports = {
    name: "shuffle",
    description: "Shuffles the queue",
    aliases: ["mix"],

    run: async (client, message, args, a, slash) => {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        }
        client.player.shuffle(message);
    }
}