import { Command } from "../../types/command";

module.exports = {
	description: "Skips current track",
	aliases: ["next"],
	commandOptions: {
		connectedToSameVC: true,
		guildOnly: true
	},

	run(client, message, _args, _guildData, _userData, _isSlashCommand) {
		return client.player.skip(message);
	}
} as Command;
