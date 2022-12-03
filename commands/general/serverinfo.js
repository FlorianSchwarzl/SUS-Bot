const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Shows information about the server",

    async run(client, message, args, a, slash) {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        }

        const sEmbed = new MessageEmbed()
            .setColor("DARK_BLUE")
            .setTitle("Server Info")
            .setThumbnail(message.guild.iconURL)
            .setAuthor({ name: `${message.guild.name} Info`, iconUrl: message.guild.iconURL() })
            .addFields({ name: "***Guild Name:***", value: `${message.guild.name}`, inline: true },
                { name: "***Guild Owner:***", value: `<@!${message.guild.ownerId}>`, inline: true },
                { name: "***Member Count:***", value: `${message.guild.memberCount}`, inline: true })
            .setTimestamp(new Date());

        message.channel.send({ embeds: [sEmbed] });
    }
}