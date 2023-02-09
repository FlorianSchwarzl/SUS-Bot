import { Command } from "../../types/command";

module.exports = {
	description: "Clears the song queue.",
	commandOptions: {
		connectedToSameVC: true,
		guildOnly: true
	},

	run(client, message, _args, _guildData, _userData, _isSlashCommand) {
		return client.player.clearQueue(message);
	}
} as Command;
