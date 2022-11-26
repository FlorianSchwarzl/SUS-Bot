const { ManageMessages } = require("../function/permissonBitField");

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

    default_member_permissions: "0x0000000000002000",

    run: async (client, message, args, slash) => {
        const channel = slash? client.channels.cache.get(message.channelId):message.channel;

        if(!slash) {
            if(!message.member.permissions.has(ManageMessages)) {
                return channel.send("You don't the required permissions to use this command.");
            }
        } else {
            message.reply({ content: 'ok', ephemeral: true });
        }

        const number = parseInt(args[0]);

        if(isNaN(number)) return channel.send("Please provide a number as the first argument.");

        if(number <= 0) return channel.send("Number must be a positive integer.");

        let temp = number;
        while(temp > 100) {
            channel.bulkDelete(100,true).catch(err => channel.send("An error occurred."));
            temp -= 100; 
        }
        channel.bulkDelete(temp,true).catch(err => channel.send("An error occurred."));

        channel.send(`Deletet ${number} messages from <#${channel.id}>`).then(msg => setTimeout(() => msg.delete(), 5000));
    }
}
