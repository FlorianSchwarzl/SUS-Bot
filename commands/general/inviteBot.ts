import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
	description: "Sends the invite link of the bot",

	async run(client, _message, _args, _guildData, _userData, _isSlashCommand) {
		return { content: "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot%20applications.commands" };
	}
} as Command;
