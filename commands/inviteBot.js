module.exports = {
    name: "invitebot",
    description: "Send the invite link of the bot",

    run: async (client, message, args, slash) => {
        console.log("inviteBot command executed");
        const channel = slash ? client.channels.cache.get(message.channelId) : message.channel;
        if (slash) {
            message.reply({ content: 'Here you go: ', ephemeral: true });
        }
        channel.send({ content: "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot%20applications.commands" });
    }
}