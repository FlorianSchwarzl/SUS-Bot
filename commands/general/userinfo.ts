import { Command } from "../../types/command";

const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    description: "Displays information about the current user.",

    run(client, message, args, _guildData, _userData, _isSlashCommand) {
        // @ts-expect-error // yes, it does exist!
        const user = message.mentions!.users.first() || client.users.cache.get(args[0]) || message.author;

        return {
            embeds: [new EmbedBuilder()
                .setTitle("**Userinfo**")
                .setColor(Colors.Red)
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    { name: "Username", value: user.username, inline: true },
                    { name: "ID", value: user.id, inline: true },
                    { name: "Discriminator", value: user.discriminator, inline: true },
                    { name: "Bot", value: `${user.bot ? "Yes" : "No"}`, inline: true },
                    { name: "Verified", value: user.verified ? "Yes" : "No", inline: true },
                    { name: "Created", value: user.createdAt.toDateString(), inline: true },
                    // @ts-expect-error // WTF is this error?
                    { name: "Joined", value: new Date(message.guild.members.cache.get(user.id)!.joinedTimestamp).toDateString(), inline: true },
                )
                .setTimestamp(new Date())
                // @ts-expect-error
                .setFooter(client.config.embedFooter(client))
            ]
        };
    }
} as Command;