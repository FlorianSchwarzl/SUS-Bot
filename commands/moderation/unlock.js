const { ManageChannels, SendMessages } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const getChannelFromMention = require("../../functions/getChannelFromMention");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "unlock",
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

    run(client, message, args, guildInfo, slash) {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        } else {
            if (!message.member.permissions.has(ManageChannels)) {
                message.delete();
                return client.errorStrings.PERMISSION_ERROR;
            }
        }

        const channel = getChannelFromMention(message.guild, args[0]);
        if (channel === undefined) return "Please specify the channel you want to unlock";

        if (channel.permissionsFor(message.guild.roles.everyone).has(SendMessages))
            return "Channel isn't locked";

        channel.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: true });

        const embed = new MessageEmbed()
            .setTitle("Channel Updates")
            .setDescription(`<#${channel.id}> is now unlocked!`)
            .setColor("ORANGE")
            .setFooter(client.config.embedFooter(client))
            .setTimestamp(new Date())

        message.channel.send({ embeds: [embed] });
    }
}