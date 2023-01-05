const { ManageNicknames } = require("../../enums/permissionBitField");
const { ManageNicknames: mngNick } = require("../../enums/permissionStrings");

module.exports = {
    name: "nickname",
    aliases: ["nick"],
    description: "Nicks a user",

    options: [
        {
            name: "user",
            type: "USER",
            description: "user you want to change the nickname of",
            required: true,
        },
        {
            name: "nickname",
            type: "string",
            description: "nickname to change to",
            required: true,
        }
    ],

    default_member_permissions: mngNick,

    async run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
        } else {
            if (!message.member.permissions.has(ManageNicknames)) {
                return client.errorStrings.PERMISSION_ERROR;
            }
        }

        let mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let nickName;
        if (mentionedMember === undefined) {
            nickName = args.slice(0).join(" ");
            mentionedMember = message.member;
        }
        else nickName = args.slice(1).join(" ");

        if (nickName === undefined) return "Please provide a nickname for me to change this users nickname";

        try {
            const username = mentionedMember.nickname || mentionedMember.user.username;
            await mentionedMember.setNickname(nickName);
            return `Set nickname of ${username} to ${nickName}.`;
        } catch (err) {
            return `I do not have the required permissions to to set ${mentionedMember.nickname || mentionedMember.user.username}'s username.`;
        }
    }
}
