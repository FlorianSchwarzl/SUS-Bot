const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const getChannelFromMention = require("../../functions/getChannelFromMention");
const guilds = require("../../schemas/guild");

module.exports = {
    ignore: true, //TODO: Needs fix ASAP
    description: "Sets the goodbye channel",
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

    async run(client, message, args, guildData, userData, isSlashCommand) {
        const channel = getChannelFromMention(message.guild, args[0]);
        if (channel === undefined) channel = message.channel;
        const current = guildData.channels;
        current.goodbye = channel.id;

        guilds.findByIdAndUpdate(guildData._id, { channels: current }, (err, data) => { });
        return `Set goodbye channel to ${channel.toString()}`;
    }
}
