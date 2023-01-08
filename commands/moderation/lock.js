const { ManageChannels, SendMessages } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const getChannelFromMention = require("../../functions/getChannelFromMention");
const { MessageEmbed } = require("discord.js");

module.exports = {
    description: "Locks a channel",
    aliases: ["lockdown"],

    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to lock",
            required: true
        }
    ],

    default_member_permissions: ManageChannel,

    run(client, message, args, guildData, userData, isSlashCommand) {
        let channel = getChannelFromMention(message.guild, args[0]);
        if (channel === undefined) channel = message.channel;

        if (!channel.permissionsFor(message.guild.roles.everyone).has(SendMessages))
            return "Channel is already locked";

        channel.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: false });

        const embed = new MessageEmbed()
            .setTitle("Channel Updates")
            .setDescription(`<#${channel.id}> in now locked!`)
            .setColor("ORANGE")
            .setFooter(client.config.embedFooter(client))
            .setTimestamp(new Date())

        return { embeds: [embed] };
    }
}
