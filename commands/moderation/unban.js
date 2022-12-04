const { BanMembers } = require("../../enums/permissionBitField");
const { BanMembers: banMbs } = require("../../enums/permissionStrings");

module.exports = {
    name: "unban",
    description: "Unbans a user",

    options: [
        {
            name: "user",
            type: "USER",
            description: "User you want to unban",
            required: true,
        }
    ],

    default_member_permissions: banMbs,

    run: async (client, message, args, guildInfo, slash) => {
        message.delete();

        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        } else {
            if (!message.member.permissions.has(BanMembers)) {
                return client.errorStrings.PERMISSION_ERROR;
            }
        }

        if (args[0] === undefined)
            return "Please Give Me Member ID That You Want To Unban!";

        const bans = await message.guild.bans.fetch();
        const member = bans.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bans.get(args[0]) || bans.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());

        if (member === undefined)
            return "Please Give Valid Member ID Or Member Is Not Banned!";

        try {
            await message.guild.members.unban(member.user.id, Reason);
            return `Unbanned <@!${args[0]}>. With reason: ${args.slice(1) || "No Reason Provided!"}`;
        } catch (error) {
            return "I Can't Unban That Member Maybe Member Is Not Banned Or Some Error!";
        }
    }
}