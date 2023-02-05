import { Interaction } from "discord.js";
import Client from "../../types/client";

module.exports = async (client: Client<true>, interaction: Interaction) => {
	let cmd;
	let args = [];
	let isComponent = false;

	// @ts-expect-error // "doEs NoT eXiSt"... Fuck u TS, that's y I'm checking if it exists
	if (interaction.customId)
		// @ts-expect-error // same as above
		interaction.customId = interaction.customId.toLowerCase();

	let type;

	if (interaction.isCommand()) type = "COMMAND";
	else if (interaction.isButton()) type = "BUTTON";
	else if (interaction.isStringSelectMenu()) type = "SELECT_MENU";
	else throw new Error("Unknown interaction type");

	switch (type) {
		case "COMMAND":
			// @ts-expect-error // there is a fucking switch case where I'm checking for it
			cmd = client.commands.get("command:" + interaction.commandName);
			// @ts-expect-error // same as above
			args = interaction.options?._hoistedOptions.map(e => e.value);
			break;
		case "BUTTON":
			// @ts-expect-error // same as above
			if (interaction.customId.startsWith("command:")) {
				// @ts-expect-error // same as above
				cmd = client.commands.get("command:" + interaction.customId.slice(8));
				// @ts-expect-error // same as above
				args = interaction.customId.slice(8).split(" ");
				args.shift();
			} else {
				// @ts-expect-error // same as above
				cmd = client.commands.get("button:" + interaction.customId.split(" ")[0]);
				// @ts-expect-error // same as above
				args = interaction.customId.split(" ");
				args.shift();
			}
			isComponent = true;
			break;
		case "SELECT_MENU":
			// @ts-expect-error // same as above
			cmd = client.commands.get("selectMenu:" + interaction.customId);
			// @ts-expect-error // same as above
			args = interaction.customId.split(" ");
			// @ts-expect-error // same as above
			args[0] = interaction.values[0];
			isComponent = true;
			break;
		default:
			return;
	}

	const modifiedInteraction = interaction as unknown;
	// console.log(typeof modifiedInteraction)
	// modifiedInteraction.channel = client.channels.cache.get(modifiedInteraction.channelId);
	// modifiedInteraction.author = modifiedInteraction.user;

	global.functions.executeCommand(cmd, client, modifiedInteraction, args, true, isComponent);
};
