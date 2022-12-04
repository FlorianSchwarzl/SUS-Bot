const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const getChannelFromMention = require("../../functions/getChannelFromMention");
const guilds = require("../../schemas/guild");

module.exports = {
    name: "set-welcome-channel",
    description: "Sets the welcome channel",
    aliases: ["swc"],

    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to set as welcome channel.",
            required: true
        }
    ],

    default_member_permissions: ManageChannel,

    run: async (client, message, args, guildInfo, slash) => {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        } else {
            if (!message.member.permissions.has(ManageChannels)) {
                message.delete();
                return "You don't the required permissions to use this command.";
            }
        }

        const channel = getChannelFromMention(message.guild, args[0]);
        if (channel === undefined) return "Please specify the welcome channel.";
        const current = guildInfo.channels;
        current.welcome = channel.id;

        guilds.findByIdAndUpdate(guildInfo._id, { channels: current }, (err, data) => { });
        message.channel.send(`Set welcome channel to ${channel.toString()}`);
    }
}