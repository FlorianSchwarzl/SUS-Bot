const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const guilds = require("../../schemas/guild");

module.exports = {
    ignore: true, //TODO: Needs fix ASAP
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
        let channel = global.functions.getChannelFromMention(message.guild, args[0]);
        if (channel === undefined) channel = message.channel;
        const current = guildData.channels;
        current.counter = channel.id;

        guilds.findByIdAndUpdate(guildData._id, { channels: current }, (err, data) => { });
        return `Set counter channel to ${channel.toString()}`;
    }
}
