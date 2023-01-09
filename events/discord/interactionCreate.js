const executeCommand = require("../../functions/executeCommand.js");

module.exports = async (client, interaction) => {
	let cmd;
	let args = [];
	let isComponent = false;

	if (interaction.customId)
		interaction.customId = interaction.customId.toLowerCase();

	let type;

	if (interaction.isCommand()) type = "COMMAND";
	else if (interaction.isButton()) type = "BUTTON";
	else if (interaction.isSelectMenu()) type = "SELECT_MENU";
	else throw new Error("Unknown interaction type");

	switch (type) {
		case "COMMAND":
			cmd = client.commands.get("command:" + interaction.commandName);
			args = interaction.options?._hoistedOptions.map(e => e.value);
			break;
		case "BUTTON":
			if (interaction.customId.startsWith("command:")) {
				cmd = client.commands.get("command:" + interaction.customId.slice(8));
				args = interaction.customId.slice(8).split(" ");
				args.shift();
			} else {
				cmd = client.commands.get("button:" + interaction.customId.split(" ")[0]);
				args = interaction.customId.split(" ");
				args.shift();
			}
			isComponent = true;
			break;
		case "SELECT_MENU":
			cmd = client.commands.get("selectMenu:" + interaction.customId);
			args = interaction.customId.split(" ");
			args[0] = interaction.values[0];
			isComponent = true;
			break;
		default:
			return;
	}
	interaction.channel = client.channels.cache.get(interaction.channelId);
	interaction.author = interaction.user;

	executeCommand(cmd, client, interaction, args, true, isComponent);
}
