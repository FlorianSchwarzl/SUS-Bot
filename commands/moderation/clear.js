const { ManageMessages } = require("../../enums/permissionBitField");
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

        let temp = 0;
        while (0 < number) {
            const sus = await message.channel.bulkDelete(100, true).catch(err => message.channel.send("An error occurred."));
            if(!sus || (sus.size === 0)) {
                break;
            }
            temp += sus.size;
        }

        message.channel.send(`Deleted ${temp} messages from <#${message.channel.id}>`).then(msg => setTimeout(() => msg.delete(), 5000));
        if(temp === 0) {
            message.channel.send("I can't delete messages which are older than two weeks.")
        }
    }
}
