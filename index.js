const { Client, Collection, Intents } = require('discord.js');
const Player = require('./music/player');
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

client.player = new Player(client);
client.commands = new Collection();
client.config = require('./config');

/* Loading all the commands. */
fs.readdirSync("./commands").forEach(dir => {
    fs.readdirSync(`./commands/${dir}`).filter(e => e.endsWith(".js")).forEach(e => {
        const command = require(`./commands/${dir}/${e}`);
        if (!command.name.length) return;
        command.category = dir;
        client.commands.set(command.name, command);    
    })
});

/* Loading all the events. */
fs.readdirSync("./events").filter(f => f.endsWith(".js")).forEach((e) => {
    client.on(e.split(".")[0], require(`./events/${e}`).bind(null, client));
});

/* Logging the bot in. */
client.login(process.env.TOKEN);