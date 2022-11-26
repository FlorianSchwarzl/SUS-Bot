module.exports = {
    name: "shuffle",
    description: "Shuffles the queue",
    aliases: ["mix"],

    run: async (client, message, args, slash) => {
        const channel = slash ? client.channels.cache.get(message.channelId) : message.channel;
        if (slash) {
            message.reply({ content: 'ok', ephemeral: true });
        }

        if (!message.member.voice?.channel) return channel.send('Connect to a Voice Channel');

        const queue = client.queue.find(e => e.guildId === message.guild.id);

        if (!queue) {
            return channel.send("Currently not playing.");
        }

        if (queue.voice_channel !== message.member.voice.channel.id)
            return channel.send("You have to be in the same voice channel as the bot to shuffle the queue.");

        const shuffle = require("../function/shuffle.js");
        queue.queue = shuffle(queue.queue);

        channel.send("Shuffled the queue.");
    }
}