import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const { StringUtil } = require("sussy-util");
const fs = require("fs");

module.exports = {
	description: "Displays all commands / more information about one command",
	aliases: ["h"],

	options: [
		{
			name: "query",
			description: "name of the command",
			type: ApplicationCommandOptionType.String,
			required: false,
		}
	],

	run(client, _message, args, _guildData, _userData, _isSlashCommand) {
		const menu = new StringSelectMenuBuilder()
			.setCustomId("help")
			.setPlaceholder("Select a category");
		const component = new ActionRowBuilder();
		const commandName = args[0];
		const embed = new EmbedBuilder()
			.setTimestamp(new Date())
			.setTitle("Help panel")
			// @ts-expect-error // something wrong here, idfk
			.setFooter(client.config.embedFooter(client));

		if (commandName === undefined || commandName.length === 0) {
			embed
				.setDescription(`To see more information type **${client.config.prefix}help {command name}**`);

			fs.readdirSync(`${__dirname}/../`).forEach((d: unknown) => {
				embed.addFields({
					name: StringUtil.capitalize(d),
					value: "Type `" + client.config.prefix + "help " + d + "` to see more information",
				});
				menu.addOptions({ label: StringUtil.capitalize(d), value: d });
			});
		} else {
			const cmd = client.commands.get(`command:${commandName}`) ||
				client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (cmd === undefined) {
				return "No command found for: `" + commandName + "`";
			}

			// TODO: Add more information

			embed.addFields(
				{
					name: "Name",
					value: cmd.name,
					inline: true
				},
				{
					name: "Description",
					value: cmd.description,
					inline: true
				},
				{
					name: "Category",
					value: cmd.category,
					inline: true
				},
				{
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					name: cmd.aliases!.length > 1 ? "Aliases" : "Alias",
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					value: cmd.aliases!.length > 0 ? cmd.aliases?.join(", ") : "None",
					inline: true
				},
				{
					name: "Cooldown",
					// @ts-expect-error // I'm checking if it exists, so it should be fine
					value: cmd.commandOptions?.defaultReturn?.cooldown ? `${cmd.cooldown}seconds` : "None",
					inline: true
				}
			);
		}
		if (menu.options.length > 0) {
			component.addComponents(menu);
			return { embeds: [embed], components: [component] };
		} else {
			return { embeds: [embed] };
		}
	}
} as Command;
