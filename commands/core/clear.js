const { ManageMessages } = require("../../enums/permissonBitField");
const { ManageMessages: manageMsgs } = require("../../enums/permissionStrings");

module.exports = {
    name: "clear",
    description: "clear channel up to the specified number of messages",

    options: [
        {
            name: "query",
            type: "NUMBER",
            description: "amount of messages to clear",
            required: true
        }
    ],

    default_member_permissions: manageMsgs,

    run: async (client, message, args, slash) => {
        if (!slash) {
            if (!message.member.permissions.has(ManageMessages)) {
                return message.channel.send("You don't the required permissions to use this command.");
            }
        } else {
            message.reply({ content: 'ok', ephemeral: true });
        }

        const number = parseInt(args[0]);

        if (isNaN(number)) return message.channel.send("Please provide a number as the first argument.");

        if (number <= 0) return message.channel.send("Number must be a positive integer.");

        let temp = number;
        while (temp > 100) {
            message.channel.bulkDelete(100, true).catch(err => message.channel.send("An error occurred."));
            temp -= 100;
        }
        message.channel.bulkDelete(temp, true).catch(err => message.channel.send("An error occurred."));

        message.channel.send(`Deletet ${number} messages from <#${message.channel.id}>`).then(msg => setTimeout(() => msg.delete(), 5000));
    }
}
