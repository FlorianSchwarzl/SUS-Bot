const { ManageNicknames } = require("../../enums/permissionBitField");
const { ManageNicknames: mngNick } = require("../../enums/permissionStrings");

module.exports = {
    aliases: ["remove-nick", "reset-nick", "reset-nickname", "un-nick", "un-nickname", "unnick", "unnickname", "removenick", "removenickname"],
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
        let mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (mentionedMember === undefined)
            mentionedMember = message.member;

        try {
            const username = mentionedMember.nickname || mentionedMember.user.username;
            await mentionedMember.setNickname(null);
            return `Reset nickname of ${username}.`;
        } catch (err) {
            return `I do not have the required permissions to to reset ${mentionedMember.nickname || mentionedMember.user.username}'s username.`;
        }
    }
}
