module.exports = {
    name: "troll",
    aliases: ["t"],
    category: "Music",
    description: "A wild troll appeared.",
    connectedToVoiceChannel: true,

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (!isSlashCommand) message.delete();

        // Low the user using the command
        console.log(`${message.author.username} used the troll command.`);
        return client.player.troll(message);
    }
}
