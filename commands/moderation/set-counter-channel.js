const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const getChannelFromMention = require('../../functions/getChannelFromMention');
const guilds = require('../../schemas/guild');

module.exports = {
    name: 'set-counter-channel',
    description: "Set the counter channel for",
    aliases: ["scc"],

    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to set as counter channel.",
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
        if(!channel) return message.channel.send("Please specify the counter channel.");
        const current = guildInfo.channels;
        current.counter = channel.id;

        guilds.findByIdAndUpdate(guildInfo._id, { channels: current }, (err, data) => {});
    }
}