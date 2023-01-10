const { ManageMessages } = require("../../enums/permissionBitField");
const { ManageMessages: manageMsgs } = require("../../enums/permissionStrings");

module.exports = {
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

        if (args[0] === "all") {
            clearAllMessages(message, isSlashCommand).then(deletedMessagesCount => {
                if (isSlashCommand)
                    message.followUp(`Deleted ${deletedMessagesCount} messages from <#${message.channel.id}>. Please keep in mind, I can't delete messages older than two weeks!`).then(msg => setTimeout(() => msg.delete(), 5000));
                else
                    message.channel.send(`Deleted ${deletedMessagesCount} messages from <#${message.channel.id}>. Please keep in mind, I can't delete messages older than two weeks!`).then(msg => setTimeout(() => msg.delete(), 5000));
            }).catch(err => {
                if (isSlashCommand)
                    message.followUp(err);
                else
                    message.channel.send
            });

            return null;
        } else if (isNaN(amount)) return "Please provide a number as the first argument.";

        if (amount <= 0) return "Number must be at least 1.";

        clearMessages(message, amount, isSlashCommand).then(deletedMessagesCount => {
            if (isSlashCommand)
                message.followUp(`Deleted ${deletedMessagesCount} messages from <#${message.channel.id}>. Please keep in mind, I can't delete messages older than two weeks!`).then(msg => setTimeout(() => msg.delete(), 5000));
            else
                message.channel.send(`Deleted ${deletedMessagesCount} messages from <#${message.channel.id}>. Please keep in mind, I can't delete messages older than two weeks!`).then(msg => setTimeout(() => msg.delete(), 5000));
        }).catch(err => {
            if (isSlashCommand)
                message.followUp(err);
            else
                message.channel.send(err);
        });

        return null;
    }
}

function clearMessages(message, amount, isSlashCommand = false) {
    return new Promise(async (resolve, reject) => {
        let deletedMessagesCount = isSlashCommand ? 0 : -1;
        while (deletedMessagesCount < amount) {
            const deleteThisTime = Math.min(...[100, amount - deletedMessagesCount]);
            const deletedMessages = await message.channel.bulkDelete(deleteThisTime, true)
                .catch(err => reject("Cannot delete messages older than two weeks."));
            if (deletedMessages === undefined || deletedMessages.size === 0) break;
            deletedMessagesCount += deletedMessages.size;
        }
        resolve(deletedMessagesCount);
    });
}

function clearAllMessages(message, isSlashCommand = false) {
    return new Promise(async (resolve, reject) => {
        let deletedMessagesCount = isSlashCommand ? 0 : -1;
        while (true) {
            const deletedMessages = await message.channel.bulkDelete(100, true)
                .catch(err => reject("Cannot delete messages older than two weeks."));
            if (deletedMessages === undefined || deletedMessages.size === 0) break;
            deletedMessagesCount += deletedMessages.size;
        }
        resolve(deletedMessagesCount);
    });
}