module.exports = {
    name: "shuffle",
    description: "Shuffles the queue",
    aliases: ["mix"],

    async run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) {
            message.reply({ content: "ok", ephemeral: true });
        }
        return client.player.shuffle(message);
    }
}