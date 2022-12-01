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

/* Loading all the functions. */
let functions = require("./functions/functions.js");
functions = getFiles('./functions', "functions.js");

console.log(functions);

/* Loading all the commands. */
fs.readdirSync("./commands").forEach(dir => {
    fs.readdirSync(`./commands/${dir}`).filter(e => e.endsWith(".js")).forEach(e => {
        const command = require(`./commands/${dir}/${e}`);
        if (!command.name?.length) return;
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

function getFiles(dir, exclude = null) {
    let output = [];
    fs.readdirSync(dir).forEach(path => {
        console.log(path + " " + fs.lstatSync(dir + "/" + path).isDirectory());
        if (fs.lstatSync(dir + "/" + path).isDirectory()) {
            output[path] = getFiles(dir + "/" + path, exclude);
        } else {
            const func = require(dir + "/" + path);
            output[path.replace(".js", "")] = func;
        }
    });
    return output;
}