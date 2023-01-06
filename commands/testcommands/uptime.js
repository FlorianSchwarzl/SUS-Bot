const { MessageEmbed } = require("discord.js");

module.exports = {
    "name": "uptime",
    "description": "Shows the uptime of the bot",

    async run(client, message, args, guildData, userData, isSlashCommand) {
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
        return { embeds: [uptime] };
    }
}
