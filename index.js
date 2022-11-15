const { Client, Intents, Collection } = require('discord.js');
require("dotenv").config();
const fs = require("fs");

const config = {
    token: process.env.TOKEN || "",
    prefix: process.env.PREFIX || "!",
}

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

client.commands = new Collection();
client.config = config;

fs.readdirSync('./commands').filter(e => e.endsWith('.js')).forEach(e => {
    const command = require(`./commands/${e}`);
    if(!command.name) return;
    client.commands.add(command.name.toLowerCase(), command);
});

fs.readdirSync("./events").filter(e => e.endsWith(".js")).forEach(e => {
    const event = require(`./events/${e}`);
    client.on(e.split(".")[0], event.bind(null, client));
});

client.login(client.config.token);