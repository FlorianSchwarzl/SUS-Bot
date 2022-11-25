module.exports = {
    name: "clear",
    description: "",

    options: [
        {
            name: "query",
            type: "NUMBER",
            description: "amount of messages to clear",
            required: true
        }
    ],

    run: async (client, message, args, slash) => {
        const channel = slash? client.channels.cache.get(message.channelId):message.channel;

        if(!message.guild.me.permission.has('MANAGE_MESSAGES')){
            return channel.send(`I don't have the needed permissions.`);
        }
    }
}