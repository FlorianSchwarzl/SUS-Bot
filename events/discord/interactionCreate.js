const executeCommand = require("../../functions/executeCommand.js");

module.exports = async (client, interaction) => {
	let cmd;
	let args = [];
	let isComponent = false;

	if (interaction.customId)
		interaction.customId = interaction.customId.toLowerCase();

	let type = interaction.type;

	if (type === 3) // INTERACTION_RESPONSE
		if (interaction.componentType === 2) // BUTTON
			type = 32;
		else if (interaction.componentType === 3) // SELECT_MENU
			type = 33;

	switch (type) {
		case 2: // COMMAND
			cmd = client.commands.get("command:" + interaction.commandName);
			args = interaction.options?._hoistedOptions.map(e => e.value);
			break;
		case 32: // BUTTON
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
		case 33: // SELECT_MENU
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
