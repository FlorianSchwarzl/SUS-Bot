const { ManageNicknames } = require("../../enums/permissionBitField");
const { ManageNicknames: mngNick } = require("../../enums/permissionStrings");

module.exports = {
    name: 'remove-nickname',
    aliases: ['remove-nick', 'reset-nick'],
    description: 'Remove a users nickname.',

    options: [
        {
            name: "user",
            type:"USER",
            description: "user you want to change the nickname of",
            required: true,
        }
    ],

    default_member_permissions: mngNick,

    async run(client, message, args, a, slash) {
        if (!slash) {
            if (!message.member.permissions.has(ManageNicknames)) {
                return message.channel.send("You don't the required permissions to use this command.");
            }
        } else {
            message.reply({ content: 'ok', ephemeral: true });
        }

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