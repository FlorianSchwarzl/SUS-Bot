const { ManageMessages } = require("../../enums/permissionBitField");
const { ManageMessages: manageMsgs } = require("../../enums/permissionStrings");

module.exports = {
    ignore: true,
    description: "Clears the last n messages",

    options: [
        {
            name: "query",
            type: "NUMBER",
            description: "amount of messages to clear",
            required: true
        }
    ],

    default_member_permissions: manageMsgs,

    async run(client, message, args, guildData, userData, isSlashCommand) {
        const amount = parseInt(args[0]);

        if (isNaN(amount)) return "Please provide a number as the first argument.";

        if (amount <= 0) return "Number must be at least 1.";

        let deletedMessagesCount = isSlashCommand ? 0 : -1;
        while (deletedMessagesCount < amount) {
            const deleteThisTime = Math.min(...[100, amount - deletedMessagesCount]);
            const deletedMessages = await message.channel.bulkDelete(deleteThisTime, true)
                .catch(err => message.channel.send("An error occurred."));
            if (deletedMessages === undefined || deletedMessages.size === 0) break;
            deletedMessagesCount += deletedMessages.size;
        }

        if (deletedMessagesCount === 0) {
            return "I can't delete messages which are older than two weeks.";
        }

        message.channel.send(`Deleted ${deletedMessagesCount} messages from <#${message.channel.id}>`).then(msg => setTimeout(() => msg.delete(), 5000));
    }
}
