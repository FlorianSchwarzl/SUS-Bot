module.exports = {
    name: "shuffle",
    description: "Shuffles the queue",
    aliases: ["mix"],
    connectedToSameVoiceChannel: true,

    async run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.shuffle(message);
    }
}
