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

        const queue = client.queue.find(e => e.guildId === message.guild.id);

        if (!queue) {
            return channel.send("There is nothing playing");
        }

        let resultString = `Now Playing: **${(await video_basic_info(queue.current.url)).video_details.title}**\n`;

        channel.send(resultString);
    }
}