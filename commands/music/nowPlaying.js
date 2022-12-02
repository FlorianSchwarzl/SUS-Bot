module.exports = {
    name: "nowplaying",
    description: "Shows the current song",
    aliases: ["current"],

    run: async (client, message, args, a, slash) => {
        if (slash) {                                                                            // if the command was sent as a slash command
            message.reply({ content: 'ok', ephemeral: true });                                  // send a reply to the interaction
        }

        if (!client.player.getQueue(message.guild.id)) {                                        // if there is no queue for the guild
            return message.channel.send("There is no queue");                                   // send an error message
        }

        const current = client.player.getCurrent(message.guild.id);                             // get the current song

        if (!current) {                                                                         // if there is no current song
            return message.channel.send("Currently not playing");                               // send an error message
        }

        message.channel.send(`Now Playing: **${current.title}**\n`);                            // send the current song
    }
}