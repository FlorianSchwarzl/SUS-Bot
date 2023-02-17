import { Command } from "../../types/command";

module.exports = {
	description: "Sends the invite link of the server",
	commandOptions: {
		guildOnly: true,
	},

	async run(_client, message, _args, _guildData, _userData, _isSlashCommand) {
		if (message.channel === null) throw new Error("Channel is null");
		// @ts-expect-error // I won't get to this point if the channel is a DMChannel
		const invite = await message.channel.createInvite({ unique: true, temporary: true });
		return "https://discord.gg/" + invite.code;
	}
} as Command;
