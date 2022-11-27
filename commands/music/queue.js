module.exports = {
    name: "queue",
    description: "Shows the bots queue",

    run: async (client, message, args, slash) => {
        if (slash) {                                                        // if the command was sent as a slash command
            message.reply({ content: 'ok', ephemeral: true });              // send a reply to the interaction
        }

        const playerInfo = client.player.getQueue(message.guild.id);        // get the playerInfo for the guild

        if (!playerInfo) {                                                  // if there is no queue for the guild
            return message.channel.send("There is no queue");               // send an error message
        }

        let currentString = `Current: **${playerInfo.current.title}**\n`;   // create a string with the current song
        let queueString = "";                                               // create a string for the queue

        for (let i = 0; i < playerInfo.queue.length; i++) {                 // loop through the queue
            const track = playerInfo.queue[i];                              // get the track
            queueString += `${i + 1}. **${track.title}**\n`;                // add the title of the song to the queue string
        }

        message.channel.send(currentString + queueString);                  // send the current song and the queue
    }
}