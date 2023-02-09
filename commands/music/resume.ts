import { Command } from "../../types/command";

module.exports = {
	aliases: ["unpause"],
	description: "Resumes playing",
	commandOptions: {
		connectedToSameVC: true,
		guildOnly: true
	},

	run(client, message, _args, _guildData, _userData, _isSlashCommand) {
		return client.player.resume(message);
	}
} as Command;
