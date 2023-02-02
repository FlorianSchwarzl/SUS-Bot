import { Command } from "../../types/command";

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle } = require("discord.js");

module.exports = {
	description: "Clears your level",
	aliases: ["cll", "clearlevel", "resetlevel", "rl", "resetlvl", "clearlvl"],

	run(client, _message, _args, _guildData, _userData, isInteraction) {
		const embed = new EmbedBuilder()
			.setTitle("Reset Level")
			.setDescription("Are you sure you want to reset your level?")
			.setColor(Colors.Red)
			// @ts-expect-error
			.setFooter(client.config.embedFooter(client));

		if (isInteraction) {
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId("resetLevel")
						.setLabel("Confirm")
						.setStyle(ButtonStyle.Danger),
				);

			return { embeds: [embed], components: [row], timeout: 60 };
		} else {
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`resetLevel`)
						.setLabel("Confirm")
						.setStyle(ButtonStyle.Danger),
				);
			return { content: "Check your DMs!", DM: { embeds: [embed], components: [row], timeout: 60 } };
		}
	}
} as Command;