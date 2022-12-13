module.exports = {
    name: "resume",
    aliases: ["unpause"],
    description: "Resumes playing",

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (isSlashCommand) message.reply("ok");
        return client.player.resume(message);
    }
}