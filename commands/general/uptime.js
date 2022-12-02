const { MessageEmbed } = require('discord.js');

module.exports = {
    "name": "uptime",
    "description": "Shows you the uptime of the bot",

    run: async (client, message, args, a, slash) => {
        if (slash) {
            message.reply({ content: 'ok', ephemeral: true });
        }

        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;

        const uptime = new MessageEmbed()
            .setColor("#fff7f7")
            .setDescription(` \`\📝\`\ | **__Uptime:__**`)
            .addFields({ name: "**Tage:**", value: `${days}` },
                { name: "**Stunden:**", value: `${hours}` },
                { name: "**Minuten:**", value: `${minutes}` },
                { name: "**Sekunden:**", value: `${seconds}` });
        message.channel.send({ embeds: [uptime] });
    }
}