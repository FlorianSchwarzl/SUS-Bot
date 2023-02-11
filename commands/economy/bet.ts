import { Command } from "../../types/command";

import userList from "../../schemas/user";
import { EmbedBuilder } from "discord.js";
import { IsSomething } from "sussy-util";

module.exports = {
	description: "Bet your money and win!",

	run(client, _message, args, _guildData, userData, _isSlashCommand) {

		const embed = new EmbedBuilder()
			.setTimestamp(new Date())
			.setTitle("Casino")
			.setFooter(client.config.embedFooter(client));

		if (!(IsSomething.isNumber(args[0]))) {
			embed.addFields(
				{
					name: "Bet failed!",
					value: "Please enter a valid number",
					inline: true
				}
			);
		}
		else if (+args[0] > userData.economy.wallet) {
			embed.addFields(
				{
					name: "Bet failed!",
					value: "Please enter a number less than or equal to your wallet",
					inline: true
				}
			);
		}
		else {
			const random = Math.round((Math.random()));

			switch (random) {
				case 0:
					userData.economy.wallet -= +args[0];
					embed.addFields(
						{
							name: "You Lost!",
							value: "Oh No! You lost " + args[0] + " gold!",
							inline: true
						}
					);
					break;
				default:
					userData.economy.wallet += +args[0];
					embed.addFields(
						{
							name: "You won!",
							value: "Congratulations! You won " + args[0] + " gold!",
							inline: true
						}
					);
					break;
			}
			userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err: Error, data: unknown) => {
				if (err) console.error(err);
				if (!data) return "Error: User not found.";
			});
		}
		return { embeds: [embed] };
	}
} as Command;
