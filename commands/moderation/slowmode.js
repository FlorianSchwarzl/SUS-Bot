const { IsSomething } = require("sussy-util");
const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");

module.exports = {
    name: "slowmode",
    description: "Sets the slowmode of the current channel",

    option: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to set the slowmode of",
            required: true
        },
        {
            name: "timeout",
            type: "NUMBER",
            description: "The timeout you want in seconds",
            required: false
        }
    ],

    default_member_permissions: ManageChannel,

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
        } else {
            if (!message.member.permissions.has(ManageChannels)) {
                message.delete();
                return client.errorStrings.PERMISSION_ERROR;
            }
        }

        let rate;

        let channel = client.functions.getChannelFromMention(message.guild, args[0]);
        if (channel === undefined) {
            channel = message.channel;
            rate = args[0];
        } else rate = args[1];

        if (typeof rate !== "number" || rate === 0) {
            channel.setRateLimitPerUser(0);
            return `The slowmode of ${channel.toString()} was removed.`;
        }

        channel.setRateLimitPerUser(+rate);
        return `The slowmode of ${channel.toString()} was set to ${rate} seconds.`;
    }
}
