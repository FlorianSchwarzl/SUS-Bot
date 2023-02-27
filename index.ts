//TODO: Add a command to change the prefix
//TODO: Add automated testing
//TODO: Add the ability to automatically give members with a certain level a role
import { ProcessedCommands } from "./types/command";
import ModifiedClient, { commandCollection } from "./types/client";
import getFiles from "./functions/getFiles";
import { Partials } from "discord.js";

import { Client, Collection, IntentsBitField } from "discord.js";
import { connect, connection, set } from "mongoose";
import Player from "./music/player";
import fs from "fs";
import dotenv from "dotenv";
import betterCl from "better-cl";

dotenv.config();
set("strictQuery", false);

const addToConsole = {
	success: {
		value: 4,
		color: "green",
		notIntoFile: false
	},
};

betterCl.setup(console, addToConsole, "./logs");

type ConsoleExtension = { [Key in keyof typeof addToConsole]: (...message: unknown[]) => void };

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Console extends ConsoleExtension { }
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
client.categories = new Collection();
client.config = require("./config");
client.connection = connection;

console.log(`Version: ${client.config.version} by ${client.config.authorsString}`);

declare global {
	// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any -- I have to use var here
	var functions: any;
}

console.log("Loading functions...");

global.functions = getFiles("./functions");

console.log("Loading commands...");

/* Loading all the commands. */
[
	"commands",
	"buttons",
	"selectMenus"
].forEach((name) => loadCommands(name, true));

client.commandCooldowns = new Collection();
client.commands.forEach((command: ProcessedCommands) => {
	client.commandCooldowns.set(command.name, new Collection());
});

const eventToClientMap = {
	discord: client,
	mongodb: connection
};

/* Loading all the events. */
fs.readdirSync("./events").forEach((dir: string) => {
	if (!fs.lstatSync("./events/" + dir).isDirectory())
		return console.warn(`The file ./events/${dir} is not a directory.`);
	if (!(dir in eventToClientMap)) return console.warn(`The event folder ${dir} is not valid!`);
	console.log(`Loading ${dir} events...`);
	fs.readdirSync(`./events/${dir}`).filter((e: string) => e.endsWith(".ts")).forEach((event: string) => {
		eventToClientMap[dir as keyof typeof eventToClientMap].on(event.split(".")[0], require(`./events/${dir}/${event}`).bind(null, client));
	});
});

module.exports = client;
export default client;

/* Logging the bot in. */
client.login(process.env.TOKEN);
console.info("Logging the bot in...");
/* Connect to the mongodb database */
if (!process.env.MONGODB) throw new Error("No MONGODB environment variable found!");
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
		let ignore = false;
		const tempCommands: commandCollection = new Collection();
		if (!fs.lstatSync(`./${dirName}/` + dir).isDirectory())
			return console.warn(`./${dirName}/${dir} is not a directory.`);
		fs.readdirSync(`./${dirName}/${dir}`).filter((file: string) => file.endsWith(".ts")).forEach((file: string) => {
			if (file === ".ignore") return ignore = true;
			let command = require(`./${dirName}/${dir}/${file}`);
			dirNameCollection = dirNameCollection.toLocaleLowerCase();
			command.category = `${dirNameCollection}:` + dir;
			command.name ||= file.replace(/(\.ts)$/, "").replace(/(\.js)$/, "");
			command.name = dirNameCollection + ":" + command.name.toLowerCase();
			tempCommands.set(command.name, command);
			command = command as ProcessedCommands;
			client.commands.set(command.name, command);
		});
		for (const [_name, command] of tempCommands) {
			// @ts-expect-error // I am checking if it exists
			if (command.aliases) {
				// @ts-expect-error // same here
				command.aliases.forEach((alias) => {
					client.commands.set(dirNameCollection + ":" + alias, command);
				});
			}
		}
		client.categories.set(dirNameCollection + ":" + dir, { ignore: ignore, commands: tempCommands });
	});
}
