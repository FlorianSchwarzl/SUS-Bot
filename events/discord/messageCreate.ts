import { ChannelType, Message } from "discord.js";
import Client from "../../types/client";

import guildModel from "../../schemas/guild";

module.exports = async (client: Client<true>, message: Message) => {
	if (message.author.bot) return;                                                 // Ignore bots

	if (message.channel.type !== ChannelType.DM) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const guildData = await getGuildData(message.guild!.id);

		if (global.functions.counter(message, guildData)) return;                                        // Check if the message is in the counter channel, if so, run the counter function

		if (!global.functions.checkChannelID(message, guildData)) return;                                  // Ignore messages not in allowed channels
	}

	const prefix = client.config.prefix;                                            // Get the prefix from the .env file

	if (!message.content.startsWith(prefix)) return;                                // Ignore messages that don't start with the prefix

	const args = message.content.slice(prefix.length).trim().split(/ +/g);          // Get the arguments
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const commandString = args.shift()!.toLowerCase();                               // Get the command name
	const command = client.commands.get("command:" + commandString) ||                           // Get the command from the commands collection
		// @ts-expect-error // If it not defined, it won't be called
		client.commands.find(command => command.aliases && command.aliases?.includes(commandString));
	// @ts-expect-error // I am God, I can create whatever I want TS!
	message.followUp = message.reply;

	global.functions.executeCommand(command, client, message, args, false);                          // Execute the command
};

async function getGuildData(guildId: string) {
	let guildData = await guildModel.findOne({ guildId: guildId });
	if (!guildData) {
		global.functions.addGuildDocument(guildId);
		guildData = await guildModel.findOne({ guildId: guildId });
	}
	return guildData;
}