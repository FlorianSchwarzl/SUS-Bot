module.exports = {
    description: "Sends the invite link of the server",

    async run(client, message, args, guildData, userData, isSlashCommand) {
        const invite = await message.channel.createInvite({ unique: true, temporary: true });
        return "https://discord.gg/" + invite.code;
    }
}
