module.exports = {
    run(client, interaction) {
        let returnValue = client.player.pause(interaction);
        if (returnValue !== "The track is already paused") {
            interaction.reply({ content: returnValue, ephemeral: true });
            return;
        } else {
            returnValue = client.player.resume(interaction);
        }
        interaction.reply({ content: returnValue, ephemeral: true });
    }
}
