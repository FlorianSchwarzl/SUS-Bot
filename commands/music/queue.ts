import { Command } from "../../types/command";

module.exports = {
	description: "Shows the song queue",
	aliases: ["q"],
	commandOptions: {
		connectedToSameVC: true
	},

	async run(client, message, _args, _guildData, _userData, _isSlashCommand) {
		const playerInfo = client.player.getQueue(message.guild?.id);

		if (playerInfo === undefined) {
			return "There are no songs in the queue";
		}

		const currentString = `Current: **${playerInfo.current.title}**\n`;
		let queueString = "";

		for (let i = 0; i < Math.min(playerInfo.queue.length, 18); i++) {
			const track = playerInfo.queue[i];
			queueString += `${i + 1}. **${track.title}**\n`;
		}
		if (playerInfo.queue.length > 18)
			queueString += `And ${playerInfo.queue.length - 18} more...`;

		return (currentString + queueString);
	}
} as Command;
