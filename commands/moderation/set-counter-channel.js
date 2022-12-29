const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const getChannelFromMention = require("../../functions/getChannelFromMention");
const guilds = require("../../schemas/guild");

module.exports = {
    name: "set-counter-channel",
    description: "Sets the counter channel",
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

    async run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
        } else {
            if (!message.member.permissions.has(ManageChannels)) {
                message.delete();
                return "You don't the required permissions to use this command.";
            }
        }

        const channel = getChannelFromMention(message.guild, args[0]);
        if (channel === undefined) return "Please specify the counter channel.";
        const current = guildData.channels;
        current.counter = channel.id;

        guilds.findByIdAndUpdate(guildData._id, { channels: current }, (err, data) => { });
        return `Set counter channel to ${channel.toString()}`;
    }
}
