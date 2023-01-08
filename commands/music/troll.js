module.exports = {
    ignore: true,
    aliases: ["t"],
    category: "Music",
    description: "A wild troll appeared.",
    connectedToVoiceChannel: true,

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (!isSlashCommand) message.delete();

        // Low the user using the command
        console.log(`${message.author.username} used the troll command.`);
        client.player.troll(message);
        return null;
    }
}
