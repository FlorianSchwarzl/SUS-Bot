import { Command } from "../../types/command";

module.exports = {
	description: "Stops the music and clears the queue",
	aliases: ["disconnect", "leave"],
	commandOptions: {
		connectedToSameVC: true,
		guildOnly: true
	},

	async run(client, message, _args, _guildData, _userData, _isSlashCommand) {
		return client.player.stop(message);
	}
} as Command;
