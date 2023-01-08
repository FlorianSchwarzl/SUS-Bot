//TODO: Add a command to change the prefix
//TODO: Add automated testing
//TODO: Add the ability to automatically give members with a certain level a role

const { Client, Collection, Intents } = require("discord.js");
const { connect, connection, set } = require("mongoose");
const Player = require("./music/player");
const fs = require("fs");
require("dotenv").config();
set('strictQuery', false);

require("better-cl").setup(console, [], "./logs");

console.clear();

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
client.sentMessages = new Map();
client.config = require("./config");
client.connection = connection;

console.log(`Version: ${client.config.version} by ${client.config.authorsString}`);

/* Loading all the functions. */
client.functions = require("./functions/getFiles")("./functions", "functions.js");

/* Loading all the commands. */
loadCommands("commands");
loadCommands("buttons");
loadCommands("selectMenus");

client.commandCooldowns = new Collection();
client.commands.forEach(command => {
    client.commandCooldowns.set(command.name, new Collection());
});

const eventToClientMap = {
    discord: client,
    mongodb: connection
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

module.exports = client;

/* Logging the bot in. */
client.login(process.env.TOKEN);
/* Connect to the mongodb database */
connect(process.env.MONGODB);
/* Starting the Webserver */
require("./www/index").startServer(client, process.env.PORT, () => console.success("Webserver ready!"));

// makes sure the bot doesn't crash
process.on("uncaughtException", (err) => {
    console.error(err);
});

function loadCommands(dirName, removeTrailingS = true) {
    let dirNameCollection = dirName;
    if (removeTrailingS) dirNameCollection = dirName.replace(/s$/, "");
    fs.readdirSync(`./${dirName}`).forEach(dir => {
        if (!fs.lstatSync(`./${dirName}/` + dir).isDirectory())
            return console.warn(`./${dirName}/${dir} is not a directory.`);
        fs.readdirSync(`./${dirName}/${dir}`).filter(file => file.endsWith(".js")).forEach(file => {
            const command = require(`./${dirName}/${dir}/${file}`);
            if (command.ignore) return;
            command.category = `${dirNameCollection}:` + dir;
            if (command.name === undefined) command.name = `${dirNameCollection}:` + file.replace(/(\.js)$/, "").toLowerCase();
            else command.name = `${dirNameCollection}:` + command.name.toLowerCase();
            client.commands.set(command.name, command);
        })
    });
}