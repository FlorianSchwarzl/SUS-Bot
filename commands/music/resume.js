module.exports = {
    name: "resume",
    aliases: ["unpause"],
    description: "Resumes playing",

    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.resume(message);
    }
}
