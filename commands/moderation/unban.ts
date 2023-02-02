import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

import permissionStrings from "../../enums/permissionStrings";

module.exports = {
	ignore: true,
	description: "Unbans a user",

	options: [
		{
			name: "user",
			type: ApplicationCommandOptionType.User,
			description: "User you want to unban",
			required: true,
		}
	],

	default_member_permissions: permissionStrings.BanMembers,

	async run(_client, message, args, _guildData, _userData, _isSlashCommand) {
		if (args[0] === void 0)
			return "Please Give Me Member ID That You Want To Unban!";

		const bans = await message.guild!.bans.fetch();
		const member = bans.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bans.get(args[0]) || bans.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());

		if (member === void 0)
			return "Please Give Valid Member ID Or Member Is Not Banned!";

		try {
			await message.guild!.members.unban(member.user.id, args[1] || "No Reason Provided!");
			return `Unbanned <@!${args[0]}>. With reason: ${args[1] || "No Reason Provided!"}`;
		} catch (error) {
			return "I Can't Unban That Member Maybe Member Is Not Banned Or Some Error!";
		}
	}
} as Command;
