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

        const channel = client.channels.cache.get(args[0].substring(2, args[0].length - 1));
        if (channel === undefined) return "Please specify the channel you want to set the slowmode of.";

        if (args[1] === undefined) {
            channel.setRateLimitPerUser(0);
            return `The slowmode of ${channel.toString()} was removed.`;
        }

        if (!IsSomething.isNumber(args[1] + "")) return message.channel.send("Please enter a number for the slowmode.");
        channel.setRateLimitPerUser(+args[1]);
        return message.channel.send(`The slowmode of ${channel.toString()} was set to ${args[1]}seconds.`);
    }
}
