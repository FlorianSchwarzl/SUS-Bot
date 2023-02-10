import { CommandRedirect } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
	description: "Displays all commands / more information about one command",
	aliases: ["h"],

	options: [
		{
			name: "query",
			description: "name of the command",
			type: ApplicationCommandOptionType.String,
			required: false,
		}
	],

	redirect: "selectMenu:help",
} as CommandRedirect;
