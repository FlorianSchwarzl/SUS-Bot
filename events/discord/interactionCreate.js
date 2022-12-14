const addGuildDocument = require("../../functions/addGuildDocument");
const addUserDocument = require("../../functions/addUserDocument");
const guildModel = require("../../schemas/guild");
const userModel = require("../../schemas/user");
const executeCommand = require("../../functions/executeCommand.js");

module.exports = async (client, interaction) => {
	let type = interaction.isCommand() ? "command" : interaction.isButton() ? "button" : "unknown";
	let cmd;
	let args = [];
	switch (type) {
		case "command":
			cmd = client.commands.get(interaction.commandName);
			args = interaction.options?._hoistedOptions.map(e => e.value);
			break;
		case "button":
			if (interaction.customId.startsWith("command:")) {
				cmd = client.commands.get(interaction.customId.slice(8));
				args = interaction.customId.slice(8).split(" ");
				args.shift();
			} else {
				console.log(interaction.customId.split(" ")[0]);
				cmd = client.commands.get("button:" + interaction.customId.split(" ")[0]);
				args = interaction.customId.split(" ");
				args.shift();
			}
			break;
		default:
			return;
	}
	interaction.channel = client.channels.cache.get(interaction.channelId);
	interaction.author = interaction.user;

	executeCommand(cmd, client, interaction, args, true);
}
