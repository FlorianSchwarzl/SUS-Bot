module.exports = {
    name: "pause",
    aliases: [],
    description: "Pauses the current song",

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) message.reply("ok");
        return client.player.pause(message);
    }
}