module.exports = {
    name: 'remove-nick',
    aliases: ['rem-nick', 'reset-nick'],
    description: 'Remove a users nickname.',

    options: [
        {
            name: "user",
            type:"USER",
            description: "user you want to change the nickname of",
            required: true,
        }
    ],

    async run(client, message, args) {
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if (!args[0]) return message.channel.send('You did not mention a user for me to change there nickname!');
        if (!mentionedMember) return message.channel.send('Please mention a user for me to change there nickname \`$nickname @user nickname\`');
        if(!mentionedMember.nickname) return message.channel.send("Mentioned user does not have a nickname.");

        try {
            await mentionedMember.setNickname(null);
            message.channel.send(`Removed nickname of ${mentionedMember.toString()}.`);
        } catch (err) {
            message.channel.send(`I do not have the required permissions to to set ${mentionedMember.nickname || mentionedMember.user.username} username.`);
        }
    }
}