const executeCommand = require("../../functions/executeCommand.js");

module.exports = async (client, interaction) => {
	// let type = interaction.isCommand() ? "command" : interaction.isButton() ? "button" : "unknown";
	// if (type === "unknown" && interaction.type === "MESSAGE_COMPONENT") type = "stringSelectMenu";
	let type = interaction.componentType;
	if (interaction.type == "APPLICATION_COMMAND") type = "COMMAND";
	let cmd;
	let args = [];
	console.log(interaction);
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
			break;
		case "SELECT_MENU":
			cmd = client.commands.get("selectMenu:" + interaction.customId);
			args = interaction.values;
			break;
		default:
			return;
	}
	interaction.channel = client.channels.cache.get(interaction.channelId);
	interaction.author = interaction.user;

	executeCommand(cmd, client, interaction, args, true);
}
