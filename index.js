const { Client, Collection, Intents } = require('discord.js');
const { connect, connection } = require('mongoose');
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
client.connection = connection;

/* Loading all the functions. */
client.functions = require("./functions/getFiles")('./functions', "functions.js");

/* Loading all the commands. */
fs.readdirSync("./commands").forEach(dir => {
    if(!fs.lstatSync("./commands/" + dir).isDirectory()) return;
    fs.readdirSync(`./commands/${dir}`).filter(e => e.endsWith(".js")).forEach(e => {
        const command = require(`./commands/${dir}/${e}`);
        if (!command.name?.length) return;
        command.category = dir;
        client.commands.set(command.name, command);
    })
});

const eventToClientMap = {
    discord: client,
    mongodb: connection,
};

fs.readdirSync("./events").forEach((dir) => {
    console.log(`Loading ${dir} events.`);
    fs.readdirSync(`./events/${dir}`).filter(e => e.endsWith(".js")).forEach(event => {
        eventToClientMap[dir].on(event.split(".")[0], require(`./events/${dir}/${event}`).bind(null, client));
    });
});

/* Logging the bot in. */
client.login(process.env.TOKEN);
/* Connect to the mongodb database */
connect(process.env.MONGODB);
/* Starting the Webserver */
require("./www/index").startServer(client, process.env.PORT, () => console.log("Webserver started."));