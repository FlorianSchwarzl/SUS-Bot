const { Client, Collection, Intents } = require('discord.js');
const { ImprovedArray } = require('sussyutilbyraphaelbader');
const fs = require("fs");
require('dotenv').config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

client.commands = new Collection();
client.queue = new ImprovedArray();
client.config = require('./config');

fs.readdirSync("./commands").filter(f => f.endsWith(".js")).forEach(e => {
    const command = require(`./commands/${e}`);
    if(!command.name.length) return;
    client.commands.set(command.name, command);
});

fs.readdirSync("./events").filter(f => f.endsWith(".js")).forEach((e) => {
    client.on(e.split(".")[0], require(`./events/${e}`).bind(null, client));
});

client.login(process.env.TOKEN);