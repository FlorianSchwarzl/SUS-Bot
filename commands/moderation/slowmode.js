const { IsSomething } = require("sussyutilbyraphaelbader");
const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");

module.exports = {
    name: 'slowmode',
    description: "Set the slow mode of th current channel",

    option: [
        {
            name: "timeout",
            type: "NUMBER",
            description: "the timeout you want in seconds",
            required: false
        }
    ],

    default_member_permissions: ManageChannel,
 
    run(client, message, args, slash) {
        if (!slash) {
            if (!message.member.permissions.has(ManageChannels)) {
                message.delete();
                return message.channel.send("You don't the required permissions to use this command.");
            }
        } else {
            message.reply({ content: 'ok', ephemeral: true });
        }

        if(!args[0]) {
            message.channel.setRateLimitPerUser(0);
            return message.channel.send("The slowmode was removed.");
        }

        if(!IsSomething.isNumber(args[0] + "")) return message.channel.send("Please enter a number for the slowmode.");
        message.channel.setRateLimitPerUser(+args[0]);
        return message.channel.send(`Set the slowmode to ${args[0]}seconds.`);
    }
}