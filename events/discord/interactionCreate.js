const addGuildDocument = require("../../functions/addGuildDocument");
const guildModel = require("../../schemas/guild");

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
	if (cmd) cmd.run(client, interaction, interaction.options?._hoistedOptions.map(e => e.value), guildData, true);
}

async function getGuildData(guildId) {
	let guildData = await guildModel.findOne({ guildId: guildId });
	if (guildData === undefined) {
		addGuildDocument(interaction.guild);
		guildData = await guildModel.findOne({ guildId: guildId });
	}
	return guildData;
}