const { video_basic_info } = require('play-dl');

module.exports = {
    name: "queue",
    description: "Shows the bots queue",

    run: async (client, message, args, slash) => {
        const channel = slash ? client.channels.cache.get(message.channelId) : message.channel;
        if (slash) {
            message.reply({ content: 'ok', ephemeral: true });
        }

        const queue = client.queue.find(e => e.guildId === message.guild.id);

        if (!queue) {
            return channel.send("There is no queue");
        }

        let resultString = `Current: **${(await video_basic_info(queue.current.url)).video_details.title}**\n`;

        if (queue.queue.length === 0) {
            return channel.send(resultString);
        }

        resultString += "**Queue:** \n";

        let index = 0;
        for (const elm of queue.queue) {
            const info = (await video_basic_info(elm.url)).video_details;
            resultString += `${++index}. **${info.title}**\n`;
        }
        channel.send(resultString);
    }
}