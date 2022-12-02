const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const getChannelFromMention = require('../../functions/getChannelFromMention');
const guilds = require('../../schemas/guild');

module.exports = {
    name: 'set-goodbye-channel',
    description: "Set the counter channel for",
    aliases: ["sgc"],

    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to set as goodbye channel.",
            required: true
        }
    ],
    
    default_member_permissions: ManageChannel,

    run: async(client, message, args, guildInfo, slash) => {
        if (!slash) {
            if (!message.member.permissions.has(ManageChannels)) {
                message.delete();
                return message.channel.send("You don't the required permissions to use this command.");
            }
        } else {
            message.reply({ content: 'ok', ephemeral: true });
        }

        const channel = getChannelFromMention(message.guild, args[0]);
        if(!channel) return message.channel.send("Please specify the welcome channel.");

        guilds.findByIdAndUpdate(guildInfo._id, { channels: { goodbye: channel.id, counter: guildInfo.channels.counter, welcome: guildInfo.channels.welcome } }, (err, data) => {
        })
    }
}