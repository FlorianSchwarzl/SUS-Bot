module.exports = {
    name: "invitebot",
    description: "Send the invite link of the bot",

    run: async (client, message, args, slash) => {
        if (slash) {
            message.reply({ content: 'Here you go: ', ephemeral: true });
        }
        message.channel.send({ content: "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot%20applications.commands" });
    }
}