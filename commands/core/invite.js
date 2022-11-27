module.exports = {
    name: "invite",
    description: "Send the invite link of the bot",

    run: async (client, message, args, slash) => {
        if (slash) {
            message.reply({ content: 'Here you go: ', ephemeral: true });
        }
        message.channel.createInvite({ unique: true, temporary: false }).then(invite => 
            message.channel.send({ content: "https://discord.gg/" + invite.code }));
    }
}