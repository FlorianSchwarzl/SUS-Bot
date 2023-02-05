import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
	description: "Adds a song to the queue",
	aliases: ["p"],
	connectedToVC: true,

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
		const startMillis = Date.now();
		const returnVar = await client.player.addTrack(message, args);
		console.debug(`Command ${this.name} took ${Date.now() - startMillis}ms to execute`);
		return returnVar;
	}
} as Command;
