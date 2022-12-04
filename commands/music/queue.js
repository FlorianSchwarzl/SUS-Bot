module.exports = {
    name: "queue",
    description: "Shows the song queue",

    run: async (client, message, args, a, slash) => {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        }

        const playerInfo = client.player.getQueue(message.guild.id);

        if (playerInfo === undefined) {
            return "There are no songs in the queue";
        }

        let currentString = `Current: **${playerInfo.current.title}**\n`;
        let queueString = "";

        for (let i = 0; i < playerInfo.queue.length; i++) {
            const track = playerInfo.queue[i];
            queueString += `${i + 1}. **${track.title}**\n`;
        }

        return (currentString + queueString);
    }
}