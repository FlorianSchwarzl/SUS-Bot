import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
	aliases: ["flip", "coin"],
	description: 'flips a coin',
	options: [{
		name: "headsTails",
		type: ApplicationCommandOptionType.String,
		description: "select heads or tails",
		required: false,
	}],

	run(_client, message, args, _guildData, _userData, _isSlashCommand) {
		const coinArray = ["heads", "tails"];
		let numberThrow = Math.floor(Math.random() * 2);
		if (!(args[0] === `heads`) && !(args[0] === 'tails')) {
			return coinArray[numberThrow];
		}
		message!.channel!.send(coinArray[numberThrow]);
		if (args[0] === coinArray[numberThrow]) {
			return "You are victorious!";
		}
		return "You are a loser!";
	}
} as Command;
