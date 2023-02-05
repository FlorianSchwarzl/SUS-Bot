import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

import permissionStrings from "../../enums/permissionStrings";

module.exports = {
	description: "Sets the slowmode of the current channel",

	option: [
		{
			name: "channel",
			type: ApplicationCommandOptionType.Channel,
			description: "The channel you want to set the slowmode of",
			required: true
		},
		{
			name: "timeout",
			type: ApplicationCommandOptionType.Integer,
			description: "The timeout you want in seconds",
			required: false
		}
	],

	default_member_permissions: permissionStrings.ManageChannels,

	run(_client, message, args, _guildData, _userData, _isSlashCommand) {
		let rate;

		let channel = global.functions.getChannelFromMention(message.guild, args[0]);
		if (channel === undefined) {
			channel = message.channel;
			rate = args[0];
		} else rate = args[1];

		if (typeof rate !== "number" || rate === 0) {
			channel.setRateLimitPerUser(0);
			return `The slowmode of ${channel.toString()} was removed.`;
		}

		channel.setRateLimitPerUser(+rate);
		return `The slowmode of ${channel.toString()} was set to ${rate} seconds.`;
	}
} as Command;
