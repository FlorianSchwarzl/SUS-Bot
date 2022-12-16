module.exports = {
    name: "invite",
    description: "Sends the invite link of the server",

    async run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
            message.reply({ content: "Here you go: ", ephemeral: true });
        }
        message.channel.createInvite({ unique: true, temporary: false }).then(invite =>
            message.channel.send({ content: "https://discord.gg/" + invite.code }));
    }
}
