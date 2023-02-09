import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
	description: "Adds a song to the queue",
	aliases: ["p"],
	commandOptions: {
		connectedToVC: true,
		guildOnly: true
	},

	options: [
		{
			name: "query",
			type: ApplicationCommandOptionType.String,
			description: "Link/Name of track to play",
			required: true
		}
	],

	async run(client, message, args, _guildData, _userData, _isSlashCommand) {
		// @ts-expect-error // cause it's getting caught anyway
		try { message.suppressEmbeds(true); } catch (e) { }
		const returnVar = await client.player.addTrack(message, args);
		return returnVar;
	}
} as Command;
