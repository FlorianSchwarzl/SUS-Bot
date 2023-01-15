import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

import permissionBitField from "../../enums/permissionBitField";
import permissionStrings from "../../enums/permissionStrings";
const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    description: "Unlocks a channel",
    aliases: [],

    options: [
        {
            name: "channel",
            type: ApplicationCommandOptionType.Channel,
            description: "The channel you want to unlock",
            required: true
        }
    ],

    default_member_permissions: permissionStrings.ManageChannels,

    run(client, message, args, guildData, userData, isSlashCommand) {
        // @ts-expect-error
        let channel = global.functions.getChannelFromMention(message.guild, args[0]);
        channel ||= message.channel;

        if (channel.permissionsFor(message.guild!.roles.everyone).has(permissionBitField.SendMessages))
            return "Channel isn't locked";

        channel.permissionOverwrites.edit(message.guild!.roles.everyone, { SEND_MESSAGES: true });

        const embed = new EmbedBuilder()
            .setTitle("Channel Updates")
            .setDescription(`<#${channel.id}> is now unlocked!`)
            .setColor(Colors.Red)
            // @ts-expect-error
            .setFooter(client.config.embedFooter(client))
            .setTimestamp(new Date())

        return { embeds: [embed] };
    }
} as Command;
