import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

import permissionStrings from "../../enums/permissionStrings";
import guilds from "../../schemas/guild";

module.exports = {
	ignore: true, //TODO: Needs fix ASAP
	description: "Sets the counter channel",
	aliases: ["scc"],

	options: [
		{
			name: "channel",
			type: ApplicationCommandOptionType.Channel,
			description: "The channel you want to set as counter channel.",
			required: true
		}
	],

	default_member_permissions: permissionStrings.ManageChannels,

	async run(_client, message, args, guildData, _userData, _isSlashCommand) {
		// @ts-expect-error
		let channel = global.functions.getChannelFromMention(message.guild, args[0]);
		if (channel === void 0) channel = message.channel;
		const current = guildData.channels;
		current.counter = channel.id;

		guilds.findByIdAndUpdate(guildData._id, { channels: current }, (err: Error, data: any) => {
			if (err) console.error(err);
			if (!data) return "Error: User not found.";
		});
		return `Set counter channel to ${channel.toString()}`;
	}
} as Command;
