import { Client as DiscordClient, Collection } from "discord.js";
import { ProcessedCommands } from "./command";
// @ts-expect-error // I wrote it so I can have it as a js or ts file // FIXME
import Player from "../music/player";
import { connection } from "mongoose";

interface Client<T extends boolean> extends DiscordClient<T> {
	commands: Collection<string, ProcessedCommands>;
	player: Player;
	commandCooldowns: Collection<string, Collection<string, number>>;
	config: ClientConfig;
	// eslint-disable-next-line @typescript-eslint/ban-types
	functions?: Function[];
	connection: typeof connection;
}

export default Client;

type ClientConfig = {
	token: string;
	prefix: string;
	authors: string[];
	mongoURI: string;
	authorsString: string;
	version: string;
	embedFooter: { text: string };
}
