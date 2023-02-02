import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

import permissionBitField from "../../enums/permissionBitField";
import permissionStrings from "../../enums/permissionStrings";
const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
	description: "Locks a channel",
	aliases: ["lockdown"],

	options: [
		{
			name: "channel",
			type: ApplicationCommandOptionType.Channel,
			description: "The channel you want to lock",
			required: true
		}
	],

	default_member_permissions: permissionStrings.ManageChannels,

	run(client, message, args, _guildData, _userData, _isSlashCommand) {
		// @ts-expect-error
		let channel = global.functions.getChannelFromMention(message.guild, args[0]);
		channel ||= message.channel;

		if (!channel.permissionsFor(message.guild!.roles.everyone).has(permissionBitField.SendMessages))
			return "Channel is already locked";

		channel.permissionOverwrites.edit(message.guild!.roles.everyone, { SEND_MESSAGES: false });

		const embed = new EmbedBuilder()
			.setTitle("Channel Updates")
			.setDescription(`<#${channel.id}> in now locked!`)
			.setColor(Colors.Red)
			// @ts-expect-error
			.setFooter(client.config.embedFooter(client))
			.setTimestamp(new Date())

		return { embeds: [embed] };
	}
} as Command;
