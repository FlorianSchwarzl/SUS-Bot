module.exports = {
    name: "shuffle",
    description: "Shuffles the queue",
    aliases: ["mix"],

    run: async (client, message, args, slash) => {
        if (slash) {
            message.reply({ content: 'ok', ephemeral: true });
            message.channel = client.channels.cache.get(message.channelId);
        }
        client.player.shuffle(message);
    }
}