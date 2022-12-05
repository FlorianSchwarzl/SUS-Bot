module.exports = {
    name: "resume",
    aliases: ["unpause"],
    description: "Resumes playing",

    run(client, message, args, a, slash) {
        if (slash) message.reply("ok");
        return client.player.resume(message);
    }
}