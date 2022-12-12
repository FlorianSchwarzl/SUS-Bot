const addGuildDocument = require("../../functions/addGuildDocument");
const addUserDocument = require("../../functions/addUserDocument");
const guildModel = require("../../schemas/guild");
const userModel = require("../../schemas/user");

module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return;
	const cmd = client.commands.get(interaction.commandName);
	interaction.channel = client.channels.cache.get(interaction.channelId);
	interaction.author = interaction.user;
	let guildData = await guildModel.findOne({ guildId: interaction.guild.id });
	if (!guildData) {
		addGuildDocument(interaction.guild);
		guildData = await guildModel.findOne({ guildId: interaction.guild.id });
	}

	let userData = await userModel.findOne({ userId: interaction.user.id });
	if(!userData) {
		addUserDocument(interaction.user);
		userData = await userModel.findOne({ userId: interaction.user.id });
	}
	if (cmd) cmd.run(client, interaction, interaction.options._hoistedOptions.map(e => e.value), guildData, userData, true);
}