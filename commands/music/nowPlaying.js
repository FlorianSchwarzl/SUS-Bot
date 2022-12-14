module.exports = {
    name: "nowplaying",
    description: "Shows the current song",
    aliases: ["current"],

    async run(client, message, args, guildData, userData, isSlashCommand) {
        if (client.player.getQueue(message.guild.id) === undefined) {
            return "There is no queue";
        }

        const current = client.player.getCurrent(message.guild.id);

        if (current === undefined) {
            return "Currently not playing anything";
        }

        return `Now Playing: **${current.title}**\n`;
    }
}
