import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../../types/command";

module.exports = {
	description: "Sends the invite link of the bot",

	async run(client, _message, _args, _guildData, _userData, _isSlashCommand) {
		const inviteLink = "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot%20applications.commands";
		const inviteButtonRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel("Invite me!")
					.setStyle(ButtonStyle.Link)
					.setURL(inviteLink),
				new ButtonBuilder()
					.setCustomId("support")
					.setLabel("Support me!")
					.setStyle(ButtonStyle.Success),
			);
		return { content: `Thanks for using ${client.user.tag.replace(/#.*/, "")}!`, components: [inviteButtonRow] };
	}
} as Command;
