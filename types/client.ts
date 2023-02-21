import { Client as DiscordClient, Collection } from "discord.js";
import { ProcessedCommands } from "./command";
import Player from "../music/player";
import { connection } from "mongoose";

interface Client<T extends boolean> extends DiscordClient<T> {
	commands: commandCollection;
	categories: categoryCollection;
	player: typeof Player;
	commandCooldowns: Collection<string, Collection<string, number>>;
	config: ClientConfig;
	// eslint-disable-next-line @typescript-eslint/ban-types
	functions?: Function[];
	connection: typeof connection;
}

export type commandCollection = Collection<string, ProcessedCommands>;

type category = { ignore: boolean, commands: commandCollection };

type categoryCollection = Collection<string, category>;

export default Client;

type ClientConfig = {
	token: string;
	prefix: string;
	authors: string[];
	mongoURI: string;
	authorsString: string;
	version: string;
	embedFooter: (client: Client<true>) => { text: string };
}
