const { Client, Collection, Intents } = require("discord.js");
const { connect, connection } = require("mongoose");
const Player = require("./music/player");
const fs = require("fs");
require("dotenv").config();

// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

console.clear();

console.log(`Version: ${require("./package.json")["version"]} by ${require("./package.json")["authors"].join(" and ")}`);

/* Create a new client instance */
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

/* add important stuff to client */
client.player = new Player(client);
client.commands = new Collection();
client.config = require("./config");
client.connection = connection;
client.errorStrings = {
    "NO_ERROR": "",
    "PERMISSION_ERROR": "You don't have the required permissions to run this command!",
}

/* Loading all the functions. */
client.functions = require("./functions/getFiles")("./functions", "functions.js");

module.exports = client;

/* Loading all the commands. */
fs.readdirSync("./commands").forEach(dir => {
    if (!fs.lstatSync("./commands/" + dir).isDirectory())
        return console.warn(`./commands/${dir} is not a directory.`);
    fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith(".js")).forEach(file => {
        const command = require(`./commands/${dir}/${file}`);
        if (!command.name?.length) return; // If the command either doesn't have a name or the name is empty, ignore it.
        command.category = dir;
        client.commands.set(command.name, command);
    })
});

const eventToClientMap = {
    discord: client,
    mongodb: connection,
};

/* Loading all the events. */
fs.readdirSync("./events").forEach((dir) => {
    if (!fs.lstatSync("./events/" + dir).isDirectory())
        return console.warn(`The file ./events/${dir} is not a directory.`);
    if (!eventToClientMap[dir])
        return console.warn(`The event folder ${dir} is not valid!`);
    console.log(`Loading ${dir} events...`);
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

console.log("RAM usage: " + Math.round(process.memoryUsage().rss / 1024 / 1024) + "MB");
setInterval(() => {
    console.log("RAM usage: " + Math.round(process.memoryUsage().rss / 1024 / 1024) + "MB");
}, 60000);