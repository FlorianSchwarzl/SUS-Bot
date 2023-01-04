module.exports = {
    connectedToSameVoiceChannel: true,
    run(client, interaction) {
        let returnValue = client.player.pause(interaction);
        if (returnValue !== "The track is already paused") {
            return returnValue;
        } else {
            returnValue = client.player.resume(interaction);
        }
        return returnValue;
    }
}
