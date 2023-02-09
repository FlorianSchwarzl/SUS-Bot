import { Command } from "../../types/command";

module.exports = {
	description: "Shows the current song",
	aliases: ["current"],
	commandOptions: {
		connectedToSameVC: true,
		guildOnly: true
	},

	async run(client, message, _args, _guildData, _userData, _isSlashCommand) {
		if (client.player.getQueue(message.guild?.id) === undefined) {
			return "There is no queue";
		}

		const current = client.player.getCurrent(message.guild?.id);

		if (current === undefined) {
			return "Currently not playing anything";
		}

		return `Now Playing: **${current.title}**\n`;
	}
} as Command;
