const { video_basic_info } = require('play-dl');

module.exports = {
    name: "nowplaying",
    description: "Shows the current song",
    aliases: ["current"],

    run: async (client, message, args, slash) => {
        const channel = slash ? client.channels.cache.get(message.channelId) : message.channel;
        if (slash) {
            message.reply({ content: 'ok', ephemeral: true });
        }

        const queue = client.player.getQueue(message.guild.id);
        if (!queue) {
            return channel.send("There is no queue");
        }

        channel.send(`Now Playing: **${client.player.getCurrent(message.guild.id).title}**\n`);
    }
}