import { Client as DiscordClient, Collection } from "discord.js";
import { Command } from "./command";
// @ts-ignore: Unreachable code error
import Player from "../music/player";
import { connection } from "mongoose";

export default interface Client<T extends boolean> extends DiscordClient<T> {
    commands: Collection<string, Command>;
    player: Player;
    commandCooldowns: Collection<string, Collection<string, number>>;
    config: ClientConfig;
    functions?: Function[];
    connection: typeof connection;
}

type ClientConfig = {
    token: string;
    prefix: string;
    authors: string[];
    mongoURI: string;
    authorsString: string;
    version: string;
    embedFooter: { text: string };
}
