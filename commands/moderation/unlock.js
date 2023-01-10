const { ManageChannels, SendMessages } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    description: "Unlocks a channel",
    aliases: [],

    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to unlock",
            required: true
        }
    ],

    default_member_permissions: ManageChannel,

    run(client, message, args, guildData, userData, isSlashCommand) {
        let channel = global.functions.getChannelFromMention(message.guild, args[0]);
        if (channel === undefined) channel = message.channel;

        if (channel.permissionsFor(message.guild.roles.everyone).has(SendMessages))
            return "Channel isn't locked";

        channel.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: true });

        const embed = new EmbedBuilder()
            .setTitle("Channel Updates")
            .setDescription(`<#${channel.id}> is now unlocked!`)
            .setColor(Colors.Red)
            .setFooter(client.config.embedFooter(client))
            .setTimestamp(new Date())

        return { embeds: [embed] };
    }
}
