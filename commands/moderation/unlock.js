const { ManageChannels, SendMessages } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unlock',
    description: 'Unlock a channel',
    aliases: [],

    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to lock down.",
            required: true
        }
    ],
    
    default_member_permissions: ManageChannel,

    run(client, message, args, slash) {
        if (!slash) {
            if (!message.member.permissions.has(ManageChannels)) {
                message.delete();
                return message.channel.send("You don't the required permissions to use this command.");
            }
        } else {
            message.reply({ content: 'ok', ephemeral: true });
        }

        const channel = client.channels.cache.get(args[0].substring(2, args[0].length - 1));
        if(!channel) return message.channel.send("Please specify the channel you want to unlock.");

        if(channel.permissionsFor(message.guild.roles.everyone).has(SendMessages))
            return message.channel.send("Channel isn't locked.");
        
        channel.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES:true });
        
        const embed = new MessageEmbed()
            .setTitle("Channel Updates")
            .setDescription(`<#${channel.id}> in now unlocked.`)
            .setColor("ORANGE")
            .setFooter(client.config.embedFooter(client))
            .setTimestamp(new Date())
        
        message.channel.send({ embeds:[embed] });
    }
}