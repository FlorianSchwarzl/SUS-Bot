module.exports = {
    run(client, interaction) {
        let returnValue = client.player.pause(interaction);
        if (returnValue !== "The track is already paused") {
            return { content: returnValue };
        } else {
            returnValue = client.player.resume(interaction);
        }
        return { content: returnValue };
    }
}
