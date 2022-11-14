const { Client, Intents } = require('discord.js');
require("dotenv").config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

const config = {
    token: process.env.TOKEN || "",
    prefix: process.env.PREFIX || "!",
}

client.config = config;

client.on("messageCreate", (message) => {
    if(message.content === "leon") {
        message.channel.send("halts maul");
    }
});

client.login(client.config.token);