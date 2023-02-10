//TODO: Add a command to change the prefix
//TODO: Add automated testing
//TODO: Add the ability to automatically give members with a certain level a role
import { ProcessedCommands } from "./types/command";
import ModifiedClient from "./types/client";
import getFiles from "./functions/getFiles";
import { Partials } from "discord.js";

const { Client, Collection, IntentsBitField } = require("discord.js");
const { connect, connection, set } = require("mongoose");
const Player = require("./music/player");
const fs = require("fs");
require("dotenv").config();
set("strictQuery", false);

require("better-cl").setup(console, [], "./logs");


declare global {
	interface Console {
		success: (message: string) => void;
	}
}

console.clear();

const intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.Guilds);
intents.add(IntentsBitField.Flags.GuildMembers);
intents.add(IntentsBitField.Flags.GuildMessages);
intents.add(IntentsBitField.Flags.GuildVoiceStates);
intents.add(IntentsBitField.Flags.MessageContent);
intents.add(IntentsBitField.Flags.DirectMessages);

const client = new Client({
	intents: intents,
	partials: [Partials.Channel],
}) as ModifiedClient<true>;

/* add important stuff to client */
client.player = new Player(client);
client.commands = new Collection();
client.config = require("./config");
client.connection = connection;

console.log(`Version: ${client.config.version} by ${client.config.authorsString}`);

// att the functions object to the "global" object so that it can be accessed from anywhere and make it type safe and read-only
declare global {
	// eslint-disable-next-line no-var
	var functions: any;
}

global.functions = getFiles("./functions");

/* Loading all the commands. */
[
	"commands",
	"buttons",
	"selectMenus"
].forEach((name) => loadCommands(name, true));

client.commandCooldowns = new Collection();
client.commands.forEach((command: ProcessedCommands) => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- I just set it a few lines above
	client.commandCooldowns.set(command.name!, new Collection());
});

const eventToClientMap = {
	discord: client,
	mongodb: connection
};

/* Loading all the events. */
fs.readdirSync("./events").forEach((dir: string) => {
	if (!fs.lstatSync("./events/" + dir).isDirectory())
		return console.warn(`The file ./events/${dir} is not a directory.`);
	// @ts-expect-error
	if (!eventToClientMap[dir])
		return console.warn(`The event folder ${dir} is not valid!`);
	console.log(`Loading ${dir} events...`);
	fs.readdirSync(`./events/${dir}`).filter((e: string) => e.endsWith(".ts")).forEach((event: string) => {
		// @ts-expect-error
		eventToClientMap[dir].on(event.split(".")[0], require(`./events/${dir}/${event}`).bind(null, client));
	});
});

module.exports = client;
export default client;

/* Logging the bot in. */
client.login(process.env.TOKEN);
console.info("Logging the bot in...");
/* Connect to the mongodb database */
connect(process.env.MONGODB);
/* Starting the Webserver */
console.info("Starting webserver...");
require("./www/index").startServer(client, process.env.PORT, () => console.success("Webserver ready!"));

// makes sure the bot doesn't crash
process.on("uncaughtException", (err) => {
	console.error(err);
});

function loadCommands(dirName: string, removeTrailingS = true) {
	let dirNameCollection = dirName;
	if (removeTrailingS) dirNameCollection = dirName.replace(/s$/, "");
	fs.readdirSync(`./${dirName}`).forEach((dir: string) => {
		if (!fs.lstatSync(`./${dirName}/` + dir).isDirectory())
			return console.warn(`./${dirName}/${dir} is not a directory.`);
		fs.readdirSync(`./${dirName}/${dir}`).filter((file: string) => file.endsWith(".ts")).forEach((file: string) => {
			let command = require(`./${dirName}/${dir}/${file}`);
			dirNameCollection = dirNameCollection.toLocaleLowerCase();
			command.category = `${dirNameCollection}:` + dir;
			command.name ||= file.replace(/(\.ts)$/, "");
			command.name = `${dirNameCollection}:` + command.name.toLowerCase();
			command = command as ProcessedCommands;
			client.commands.set(command.name, command);
		});
	});
}
