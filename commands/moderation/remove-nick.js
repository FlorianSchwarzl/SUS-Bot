const { ManageNicknames } = require("../../enums/permissionBitField");
const { ManageNicknames: mngNick } = require("../../enums/permissionStrings");

module.exports = {
    name: "remove-nickname",
    aliases: ["remove-nick", "reset-nick", "reset-nickname", "un-nick", "un-nickname", "unnick", "unnickname"],
    description: "Removes a user\"s nickname",

    options: [
        {
            name: "user",
            type: "USER",
            description: "User you want to change the nickname of",
            required: true,
        }
    ],

    default_member_permissions: mngNick,

    async run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
            message.reply({ content: "ok", ephemeral: true });
        } else {
            if (!message.member.permissions.has(ManageNicknames)) {
                return "You don't the required permissions to use this command.";
            }
        }

        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (args[0] === undefined) return "You did not mention a user for me to change their nickname!";
        if (mentionedMember === undefined) return "Please mention a user for me to change their nickname \`$nickname @user nickname\`";
        if (mentionedMember.nickname === undefined) return "Mentioned user does not have a nickname.";

        try {
            await mentionedMember.setNickname(null);
            message.channel.send(`Removed nickname of ${mentionedMember.toString()}.`);
        } catch (err) {
            message.channel.send(`I do not have the required permissions to to set ${mentionedMember.nickname || mentionedMember.user.username} username.`);
        }
    }
}