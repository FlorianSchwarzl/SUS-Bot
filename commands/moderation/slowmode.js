const { IsSomething } = require("sussyutilbyraphaelbader");
const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");

module.exports = {
    name: 'slowmode',
    description: "Set the slow mode of th current channel",

    option: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to lock down.",
            required: true
        },
        {
            name: "timeout",
            type: "NUMBER",
            description: "the timeout you want in seconds",
            required: false
        }
    ],

    default_member_permissions: ManageChannel,
 
    run(client, message, args, a, slash) {
        if (!slash) {
            if (!message.member.permissions.has(ManageChannels)) {
                message.delete();
                return message.channel.send("You don't the required permissions to use this command.");
            }
        } else {
            message.reply({ content: 'ok', ephemeral: true });
        }
        
        const channel = client.channels.cache.get(args[0].substring(2, args[0].length - 1));
        if(!channel) return message.channel.send("Please specify the channel you want to set the slowmode of.");

        if(!args[1]) {
            channel.setRateLimitPerUser(0);
            return message.channel.send(`The slowmode of ${channel.toString()} was removed.`);
        }

        if(!IsSomething.isNumber(args[1] + "")) return message.channel.send("Please enter a number for the slowmode.");
        channel.setRateLimitPerUser(+args[1]);
        return message.channel.send(`The slowmode of ${channel.toString()} was set to ${args[1]}seconds.`);
    }
}