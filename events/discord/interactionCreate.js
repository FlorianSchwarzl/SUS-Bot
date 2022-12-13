const addGuildDocument = require("../../functions/addGuildDocument");
const addUserDocument = require("../../functions/addUserDocument");
const guildModel = require("../../schemas/guild");
const userModel = require("../../schemas/user");

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
				cmd = client.buttons[interaction.customId.split(" ")[0]];
				args = interaction.customId.split(" ");
				args.shift();
			}
			break;
		default:
			return;
	}
	interaction.channel = client.channels.cache.get(interaction.channelId);
	interaction.author = interaction.user;
	const guildData = await getGuildData(interaction.guild.id);
	const userData = await getUserData(interaction.user.id);

	let returnValue = cmd.run(client, interaction, args, guildData, userData, true)

	if (returnValue instanceof Promise) returnValue = await returnValue;
	if ((typeof returnValue === "string" && returnValue !== "") || returnValue?.embeds !== undefined) interaction.channel.send(returnValue);
}

async function getGuildData(guildId) {
	let guildData = await guildModel.findOne({ guildId: guildId });
	if (guildData === undefined || guildData === null) {
		addGuildDocument(guildId);
		guildData = await guildModel.findOne({ guildId: guildId });
	}
	return guildData;
}

async function getUserData(userId) {
	let userData = await userModel.findOne({ userId: userId });
	console.log(userData);
	if (userData === undefined || userData === null) {
		addUserDocument(userId);
		userData = await userModel.findOne({ userId: userId });
		console.log(userData);
	}
	return userData;
}