const addGuildDocument = require("../../functions/addGuildDocument");
const guildModel = require("../../schemas/guild");

module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return;
	const cmd = client.commands.get(interaction.commandName);
	interaction.channel = client.channels.cache.get(interaction.channelId);
	interaction.author = interaction.user;
	let guildData = await guildModel.findOne({ guildId: interaction.guild.id });
	if (guildData === undefined) {
		addGuildDocument(interaction.guild);
		guildData = await guildModel.findOne({ guildId: message.guild.id });
	}
	if (cmd) cmd.run(client, interaction, interaction.options._hoistedOptions.map(e => e.value), guildData, true);
}