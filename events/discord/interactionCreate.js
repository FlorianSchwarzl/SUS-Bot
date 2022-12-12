const addGuildDocument = require("../../functions/addGuildDocument");
const addUserDocument = require("../../functions/addUserDocument");
const guildModel = require("../../schemas/guild");
const userModel = require("../../schemas/user");

module.exports = async (client, interaction) => {
	let cmd;
	if (interaction.isCommand()) cmd = client.commands.get(interaction.commandName);
	else if (interaction.isButton()) {
		try {
			return client.buttons[interaction.customId](client, interaction, await getGuildData(interaction.guild.id));
		} catch (e) {
			console.log(e);
			return interaction.reply({ content: "An unknown error occurred, sorry for the inconvenience!", ephemeral: true });
		}
	}
	else return;
	interaction.channel = client.channels.cache.get(interaction.channelId);
	interaction.author = interaction.user;
	const guildData = await getGuildData(interaction.guild.id);
	const userData = await getUserData(interaction.user.id);
	if (cmd) cmd.run(client, interaction, interaction.options?._hoistedOptions.map(e => e.value), guildData, userData, true);
}

async function getGuildData(guildId) {
	let guildData = await guildModel.findOne({ guildId: guildId });
	if (guildData === undefined) {
		addGuildDocument(guildId);
		guildData = await guildModel.findOne({ guildId: guildId });
	}
	return guildData;
}

async function getUserData(userId) {
	let userData = await userModel.findOne({ userId: userId });
	console.log(userData);
	if (userData === undefined) {
		addUserDocument(userId);
		userData = await userModel.findOne({ userId: userId });
		console.log(userData);
	}
	return userData;
}