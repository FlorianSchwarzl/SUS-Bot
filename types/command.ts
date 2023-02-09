import { CommandInteraction, ApplicationCommandOption, CacheType, Message, InteractionReplyOptions, MessageReplyOptions } from "discord.js";
import Client from "./client";
import { UserData, GuildData } from "./data";

export interface Command {
	ignore?: boolean;
	name?: string;
	aliases?: string[];
	description: string;
	options?: ApplicationCommandOption[];
	default_member_permissions?: string;
	commandOptions?: CommandOptions;
	category?: string;
	usage?: string;
	run: (client: Client<true>, message: CommandInteraction<CacheType> | Message<boolean>, args: string[], guildData: GuildData, userData: UserData, isInteraction: boolean) => CommandReturns;
}

interface CommandOptions {
	connectedToVC?: boolean;
	connectedToSameVC?: boolean;
	guildOnly?: boolean;
	defaultReturn?: CommandReturn;
	cooldown?: number;
}


interface extensionWithoutDM {
	announce?: boolean;
	success?: boolean;
	setCooldown?: Command[];
	disableOriginal?: boolean;
	deleteMessage?: boolean | number;
	deleteReply?: boolean | number;
	disable?: number | boolean;
	disableMentions?: boolean;
	timeout?: number;
}


interface MessageExtensionsWithoutDMMessage extends MessageReplyOptions, extensionWithoutDM { }

interface MessageExtensionsMessage extends MessageExtensionsWithoutDMMessage {
	DM?: MessageExtensionsWithoutDMMessage;
}


interface MessageExtensionsWithoutDMInteraction extends InteractionReplyOptions, extensionWithoutDM { }

interface MessageExtensionsInteraction extends MessageExtensionsWithoutDMInteraction {
	DM?: MessageExtensionsWithoutDMInteraction;
}


type MessageExtensions = MessageExtensionsMessage | MessageExtensionsInteraction;

export type CommandReturn = MessageExtensions | string | null;

export type CommandReturnWithoutString = MessageExtensions | null;

export type AsyncCommandReturn = Promise<CommandReturn>;

export type CommandReturns = CommandReturn | AsyncCommandReturn;

// type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type Component = Omit<Command, "description" | "name" | "aliases" | "options" | "default_member_permissions" | "commandOptions" | "category">;