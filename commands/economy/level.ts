import { Command } from "../../types/command";

const { IsSomething } = require("sussy-util");
const { EmbedBuilder } = require("discord.js");
module.exports = {
	description: "Shows the level of your account",
	aliases: ["lvl"],

	run(client, _message, _args, _guildData, userData, _isSlashCommand) {
		const embed = new EmbedBuilder()
			.setTimestamp(new Date())
			.setTitle("Level panel")
			// @ts-expect-error
			.setFooter(client.config.embedFooter(client));

		embed.addFields(
			{
				name: "Level",
				value: Math.floor(userData.level.xp / 50) + "",
				inline: true
			},
			{
				name: "XP",
				value: (userData.level.xp % 50) + "",
				inline: true
			},
		);
		return { embeds: [embed] };
	}

} as Command;
