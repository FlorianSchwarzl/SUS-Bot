module.exports = (client, interaction) => {
	if (!interaction.isCommand()) return;
	const cmd = client.commands.get(interaction.commandName);
	if(cmd) cmd.run(client, interaction, interaction.options._hoistedOptions.map(e => e.value), true);
}