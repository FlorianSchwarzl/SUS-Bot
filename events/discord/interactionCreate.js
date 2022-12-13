const addGuildDocument = require("../../functions/addGuildDocument");
const addUserDocument = require("../../functions/addUserDocument");
const guildModel = require("../../schemas/guild");
const userModel = require("../../schemas/user");

module.exports = async (client, interaction) => {
	let cmd;
	let args = [];
	if (interaction.isCommand()) {
		cmd = client.commands.get(interaction.commandName);
		args = interaction.options?._hoistedOptions.map(e => e.value);
	}
	else if (interaction.isButton()) {
		console.log(interaction.customId);
		if (interaction.customId.startsWith("command:")) {
			console.log("command");
			cmd = client.commands.get(interaction.customId.slice(8));
			args = interaction.customId.slice(8).split(" ");
			args.shift();
		} else {
			console.log("button");
			try {
				return client.buttons[interaction.customId](client, interaction, await getGuildData(interaction.guild.id));
			} catch (e) {
				console.log(e);
				return interaction.reply({ content: "An unknown error occurred, sorry for the inconvenience!", ephemeral: true });
			}
		}
	}
	else return;
	console.log("prepares to run command");
	interaction.channel = client.channels.cache.get(interaction.channelId);
	interaction.author = interaction.user;
	const guildData = await getGuildData(interaction.guild.id);
	const userData = await getUserData(interaction.user.id);
	if (cmd) {
		let returnValue = cmd.run(client, interaction, args, guildData, userData, true);
		if (returnValue instanceof Promise) returnValue = await returnValue;
		if ((typeof returnValue === "string" && returnValue !== "") || returnValue?.embeds !== undefined) interaction.channel.send(returnValue);
	}
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