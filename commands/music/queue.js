module.exports = {
    name: "queue",
    description: "Shows the song queue",
    aliases: ["q"],
    connectedToSameVoiceChannel: true,

    async run(client, message, args, guildData, userData, isSlashCommand) {
        const playerInfo = client.player.getQueue(message.guild.id);

        if (playerInfo === undefined) {
            return "There are no songs in the queue";
        }

        let currentString = `Current: **${playerInfo.current.title}**\n`;
        let queueString = "";

        for (let i = 0; i < Math.min(playerInfo.queue.length, 18); i++) {
            const track = playerInfo.queue[i];
            queueString += `${i + 1}. **${track.title}**\n`;
        }
        if (playerInfo.queue.length > 18)
            queueString += `And ${playerInfo.queue.length - 18} more...`;

        return (currentString + queueString);
    }
}
