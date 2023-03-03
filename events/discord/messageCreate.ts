import { ChannelType, Message } from "discord.js";
import Client from "../../types/client";

import guildModel from "../../schemas/guild";

module.exports = async (client: Client<true>, message: Message) => {
	if (message.author.bot) return;

	if (message.channel.type !== ChannelType.DM) {
		const guildData = await global.functions.getGuildData(message.guild?.id);

		if (global.functions.counter(message, guildData)) return;

		if (!global.functions.checkChannelID(message, guildData)) return;
	}

	const prefix = client.config.prefix;

	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const commandString = args.shift()!.toLowerCase();
	const command = client.commands.get("command:" + commandString);
	// @ts-expect-error // I am God, I can create whatever I want TS!
	message.followUp = message.reply;

	global.functions.executeCommand(command, client, message, args, false);
};