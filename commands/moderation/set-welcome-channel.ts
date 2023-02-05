import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

import permissionStrings from "../../enums/permissionStrings";
import guilds from "../../schemas/guild";
import { GuildData } from "../../types/data";

module.exports = {
	ignore: true, //TODO: Needs fix ASAP
	description: "Sets the welcome channel",
	aliases: ["swc"],

	options: [
		{
			name: "channel",
			type: ApplicationCommandOptionType.Channel,
			description: "The channel you want to set as welcome channel.",
			required: true
		}
	],

	default_member_permissions: permissionStrings.ManageChannels,

	async run(_client, message, args, guildData, _userData, _isSlashCommand) {
		let channel = global.functions.getChannelFromMention(message.guild, args[0]);
		channel ||= message.channel;
		const current = guildData.channels;
		current.welcome = channel.id;

		guilds.findByIdAndUpdate(guildData._id, { channels: current }, (err: Error, data: GuildData) => {
			if (err) console.error(err);
			if (!data) return "Error: User not found.";
		});
		return `Set welcome channel to ${channel.toString()}`;
	}
} as Command;
