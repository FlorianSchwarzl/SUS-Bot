import { CommandInteraction } from "discord.js";
import { Command } from "../../types/command";

const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
	description: "Displays information about the current user.",

	run(client, message, args, _guildData, _userData, _isSlashCommand) {
		let user;
		if (message instanceof CommandInteraction) {
			user = message.options.getUser("user") || message.user;
		} else {
			user = message.mentions.users.first() || message.guild?.members.cache.get(args[0])?.user || message.author;
		}

		if (message.guild === null) throw new Error("Guild is null");

		const joinDate = message.guild.members.cache.get(user.id)?.joinedTimestamp;

		return {
			embeds: [new EmbedBuilder()
				.setTitle("**User info**")
				.setColor(Colors.Red)
				.setThumbnail(user.displayAvatarURL())
				.addFields(
					{ name: "Username", value: user.username, inline: true },
					{ name: "ID", value: user.id, inline: true },
					{ name: "Discriminator", value: user.discriminator, inline: true },
					{ name: "Bot", value: `${user.bot ? "Yes" : "No"}`, inline: true },
					{ name: "Created", value: user.createdAt.toDateString(), inline: true },
					{ name: "Joined", value: joinDate ? new Date().toDateString() : "Unknown", inline: true },
				)
				.setTimestamp(new Date())

				.setFooter(client.config.embedFooter(client))
			]
		};
	}
} as Command;