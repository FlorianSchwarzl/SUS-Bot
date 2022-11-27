const { video_basic_info } = require('play-dl');

module.exports = {
    name: "queue",
    description: "Shows the bots queue",

    run: async (client, message, args, slash) => {
        const channel = slash ? client.channels.cache.get(message.channelId) : message.channel;
        if (slash) {
            message.reply({ content: 'ok', ephemeral: true });
        }

        const queue = client.player.getQueue(message.guild.id);

        if (!queue) {
            return channel.send("There is no queue");
        }

        let resultString = `Current: **${queue.current.title}**\n`;

        if (queue.queue.length === 0) {
            return channel.send(resultString);
        }

        let index = 0;
        for (const elm of queue.queue) {
            resultString += `${++index}. **${elm.title}**\n`;
        }
        
        channel.send(resultString);
    }
}