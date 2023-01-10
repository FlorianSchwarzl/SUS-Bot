const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const guilds = require("../../schemas/guild");

module.exports = {
    ignore: true, //TODO: Needs fix ASAP
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

    async run(client, message, args, guildData, userData, isSlashCommand) {
        const channel = global.functions.getChannelFromMention(message.guild, args[0]);
        if (channel === undefined) channel = message.channel;
        const current = guildData.channels;
        current.welcome = channel.id;

        guilds.findByIdAndUpdate(guildData._id, { channels: current }, (err, data) => { });
        return `Set welcome channel to ${channel.toString()}`;
    }
}
