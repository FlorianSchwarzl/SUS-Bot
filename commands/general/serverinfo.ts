import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    description: "Shows information about the server",

    async run(client, message, args, guildData, userData, isSlashCommand) {
        const sEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle("Server Info")
            .setThumbnail(message.guild!.iconURL())
            .setAuthor({ name: `${message.guild!.name} Info`, iconUrl: message.guild!.iconURL() })
            .addFields({ name: "***Guild Name:***", value: `${message.guild!.name}`, inline: true },
                { name: "***Guild Owner:***", value: `<@!${message.guild!.ownerId}>`, inline: true },
                { name: "***Member Count:***", value: `${message.guild!.memberCount}`, inline: true })
            .setTimestamp(new Date());

        return { embeds: [sEmbed] };
    }
} as Command;
