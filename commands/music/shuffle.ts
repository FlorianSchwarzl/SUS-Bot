import { Command } from "../../types/command";

module.exports = {
	description: "Shuffles the queue",
	aliases: ["mix"],
	commandOptions: {
		connectedToSameVC: true,
		guildOnly: true
	},

	async run(client, message, _args, _guildData, _userData, _isSlashCommand) {
		return client.player.shuffle(message);
	}
} as Command;
