module.exports = {
    name: "invite",
    description: "Send the invite link of the bot",

    run: async (client, message, args, slash) => {
        console.log("inviteBot command executed");
        const channel = slash ? client.channels.cache.get(message.channelId) : message.channel;
        if (slash) {
            message.reply({ content: 'Here you go: ', ephemeral: true });
        }
        message.channel.createInvite({ unique: true, temporary: false }).then(invite => {
            channel.send({ content: "https://discord.gg/" + invite.code });
        });
    }
}