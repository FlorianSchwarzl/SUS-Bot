import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

import permissionStrings from "../../enums/permissionStrings";

module.exports = {
    aliases: ["nick"],
    description: "Nicks a user",

    options: [
        {
            name: "user",
            type: ApplicationCommandOptionType.User,
            description: "user you want to change the nickname of",
            required: true,
        },
        {
            name: "nickname",
            type: ApplicationCommandOptionType.String,
            description: "nickname to change to",
            required: true,
        }
    ],

    default_member_permissions: permissionStrings.ManageNicknames,

    async run(_client, message, args, _guildData, _userData, _isSlashCommand) {
        // @ts-expect-error
        let mentionedMember = message.mentions.members.first() || message.guild!.members.cache.get(args[0]);
        let nickName;
        if (mentionedMember === void 0) {
            nickName = args.slice(0).join(" ");
            mentionedMember = message.member;
        }
        else nickName = args.slice(1).join(" ");

        if (nickName === void 0) return "Please provide a nickname for me to change this users nickname";

        try {
            const username = mentionedMember.nickname || mentionedMember.user.username;
            await mentionedMember.setNickname(nickName);
            return `Set nickname of ${username} to ${nickName}.`;
        } catch (err) {
            return `I do not have the required permissions to to set ${mentionedMember.nickname || mentionedMember.user.username}'s username.`;
        }
    }
} as Command;
