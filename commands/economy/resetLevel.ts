import { BaseInteraction, DMChannel } from "discord.js";
import { Command } from "../../types/command";

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle } = require("discord.js");

module.exports = {
	description: "Clears your level",
	aliases: ["clearXP", "resetXP", "clearLevel", "resetLevel"],

	run(client, message, _args, _guildData, _userData, _isInteraction) {
		const embed = new EmbedBuilder()
			.setTitle("Reset Level")
			.setDescription("Are you sure you want to reset your level?")
			.setColor(Colors.Red)

			.setFooter(client.config.embedFooter(client));

		if (message instanceof BaseInteraction || message.channel instanceof DMChannel) {
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
						.setCustomId("resetLevel")
						.setLabel("Confirm")
						.setStyle(ButtonStyle.Danger),
				);
			return { content: "Check your DMs!", DM: { embeds: [embed], components: [row], timeout: 60 } };
		}
	}
} as Command;