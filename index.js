const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

client.on("messageCreate", (message) => {
    if(message.content === "leon") {
        message.channel.send("halts maul");
    }
});
