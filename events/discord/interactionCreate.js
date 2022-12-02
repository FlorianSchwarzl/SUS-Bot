const addGuildDocument = require("../../functions/addGuildDocument");
const guildModel = require("../../schemas/guild");

module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return;
	const cmd = client.commands.get(interaction.commandName);
	interaction.channel = client.channels.cache.get(interaction.channelId);
	interaction.author = interaction.user;
	let sus = await guildModel.findOne({ guildId: message.guild.id });
    if(!sus) {
        addGuildDocument(message.guild);
        sus =  await guildModel.findOne({ guildId: message.guild.id });
    }
	if (cmd) cmd.run(client, interaction, interaction.options._hoistedOptions.map(e => e.value), sus, true);
}