import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

import permissionStrings from "../../enums/permissionStrings";
// TODO: write temp ban command

module.exports = {
	ignore: true,
	description: "",
	aliases: ["tempban", "temp-ban"],

	options: [
		{
			name: "user",
			type: ApplicationCommandOptionType.User,
			description: "User you want to tempban",
			required: true,
		},
		{
			name: "days",
			type: ApplicationCommandOptionType.Integer,
			description: "The amount of days you want to ban the user",
			required: true
		}
	],

	default_member_permissions: permissionStrings.BanMembers,

	run(client, message, args, guildData, userData, isSlashCommand) {


	}
} as Command;
