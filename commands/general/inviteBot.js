module.exports = {
    name: "invitebot",
    description: "Sends the invite link of the bot",

    async run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
            message.reply({ content: "Here you go: ", ephemeral: true });
        }
        message.channel.send({ content: "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot%20applications.commands" });
    }
}
