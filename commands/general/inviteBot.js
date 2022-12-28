module.exports = {
    name: "invitebot",
    description: "Sends the invite link of the bot",

    async run(client, message, args, guildData, userData, isSlashCommand) {
        message.channel.send({ content: "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot%20applications.commands" });
    }
}
