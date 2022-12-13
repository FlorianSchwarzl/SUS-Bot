module.exports = {
    name: "loop",
    description: "Loops the current queue.",
    aliases: ["repeat"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) message.reply("ok");
        return client.player.toggleLoop(message);
    },
};