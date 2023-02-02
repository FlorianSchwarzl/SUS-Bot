import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

const { EmbedBuilder, version: discordjsVersion, Colors } = require("discord.js");
const ms = require("@parade/pretty-ms");

module.exports = {
    description: "Displays information about the bot.",

    run(client, _message, _args, _guildData, _userData, _isSlashCommand) {
        return {
            embeds: [new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle(`${client.user.username} v${require("../../package.json")["version"]}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setURL("https://github.com/plastik-flasche/SUS-Bot")
                .addFields(
                    { name: "Uptime", value: `${ms(client.uptime)}`, inline: true },
                    { name: "WebSocket Ping", value: `${client.ws.ping}ms`, inline: true },
                    { name: "Discord.js", value: `${discordjsVersion}`, inline: true },
                    { name: "Guild Count", value: `${client.guilds.cache.size} guilds`, inline: true },
                    { name: "User Count", value: `${client.users.cache.size} users`, inline: true },
                    { name: "Commands", value: `${client.commands.filter(e => e.name!.startsWith("command:") && !e.ignore).size} commands`, inline: true },
                    { name: "Memory", value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap`, inline: true },
                    { name: "Cached Data", value: `${client.users.cache.size} users\n${client.emojis.cache.size} emojis`, inline: true },
                    { name: "Node", value: `${process.version} on ${process.platform} ${process.arch}`, inline: true }
                )
                // @ts-expect-error
                .setFooter(client.config.embedFooter(client))
                .setTimestamp(new Date())
            ]
        };
    }
} as Command;