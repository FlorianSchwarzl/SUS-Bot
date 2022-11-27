module.exports = (client, interaction) => {
	if (!interaction.isCommand()) return;
	const cmd = client.commands.get(interaction.commandName);
	client.channel = client.channels.cache.get(message.channelId);
	if (cmd) cmd.run(client, interaction, interaction.options._hoistedOptions.map(e => e.value), true);
}