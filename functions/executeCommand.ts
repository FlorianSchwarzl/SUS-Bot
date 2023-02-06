import { PermissionResolvable, Message, ActionRowBuilder } from "discord.js";
import { Command, CommandReturns, CommandReturnWithoutString } from "../types/command";
import Client from "../types/client";
import logTime from "../logTime";

// TODO: Add automated argument checking

import getGuildData from "./getGuildData";
import getUserData from "./getUserData";
import sendMessage from "./sendMessage";


module.exports = async (command: Command, client: Client<true>, interaction: Message, args: string[], isInteraction: boolean, isComponent = false) => {
	if (command === undefined) return;
	if (interaction === undefined) return;
	if (interaction.member === null) return interaction.reply("You need to be in a server to use this command.");
	if (client === undefined) return interaction.reply("The bot is currently restarting. Please try again in a few seconds.");

	// @ts-expect-error // It will only use the .message property if it's a component interaction
	interaction.author ||= interaction.message.author;

	if (command.ignore) return interaction.reply("This command is currently disabled.");

	if (command.default_member_permissions
		&& !isInteraction
		&& !interaction.member.permissions.has(command.default_member_permissions as PermissionResolvable)) {
		const permissionString = getPermissionsString(command.default_member_permissions);
		const moreThanOne = (permissionString.match(/,/g) || []).length;
		const outputString = `You don't have the permission to use this command. You need the following permission${moreThanOne ? "s" : ""}: ${permissionString}`;
		return interaction.reply(outputString);
	}

	if (command.commandOptions?.connectedToSameVC)
		command.commandOptions.connectedToVC = true;

	if (command.commandOptions?.connectedToVC && !interaction.member.voice?.channel)
		return interaction.reply("You need to be in a voice channel to use this command.");

	if (command.commandOptions?.connectedToSameVC && client.player?.getQueue(interaction.guildId)?.voiceChannel !== interaction.member.voice?.channel?.id) {
		if (client.player.getQueue(interaction.guildId)?.voiceChannel === undefined)
			return interaction.reply("I am not in a voice channel.");
		return interaction.reply("You need to be in the same voice channel as me to use this command.");
	}

	const cooldownReturn = checkCooldown(command, interaction, client);
	if (typeof cooldownReturn === "string") return interaction.reply(cooldownReturn);

	// makes reply unavailable so two replies can't be sent
	const reply = interaction.reply;
	interaction.reply = () => { throw new Error("Cannot reply outside of executeCommand. Use return or message.channel.send() instead!"); };
	// @ts-expect-error
	const deferReply = interaction.deferReply;
	// @ts-expect-error
	interaction.deferReply = () => { throw new Error("Cannot defer reply outside of executeCommand. Use return null instead!"); };

	try {
		if (command.commandOptions?.guildOnly && interaction.guildId === null) return interaction.reply("This command can only be used in a server.");

		let guildData = null;
		if (interaction.guild)
			guildData = await getGuildData(interaction.guild.id);
		if (guildData === undefined) guildData = null;

		const userData = await getUserData(interaction.author.id);

		const startTime = process.hrtime();
		const returnValue: CommandReturnWithoutString = await formatCommandReturn(command.run(client, interaction, args, guildData, userData, isInteraction), command);
		logTime(command, process.hrtime(startTime));

		if (returnValue === null) {
			// @ts-expect-error
			interaction.deferReply = deferReply;
			// @ts-expect-error
			if (isInteraction) interaction.deferReply();
			return;
		}

		// @ts-expect-error // cause if it's undefined, it's not doing anything anyway
		const success = returnValue.success || command.commandOptions?.defaultReturn?.success;

		if (!(success === false) && command.commandOptions?.cooldown) {
			if (returnValue.setCooldown)
				returnValue.setCooldown.push(command);
			else
				returnValue.setCooldown = [command];
		}

		// @ts-expect-error // cause if it's undefined, it's not doing anything anyway
		const cooldownArray: Command[] | undefined = returnValue.setCooldown || command.commandOptions?.defaultReturn?.setCooldown;

		if (cooldownArray !== undefined)
			cooldownArray.forEach(commandObject => {
				setCooldown(commandObject, interaction, client);
			});

		// makes reply available again
		interaction.reply = reply;

		if (returnValue.DM !== undefined && returnValue.DM !== null) {
			sendMessage(returnValue.DM, command, client, interaction, args, isInteraction, guildData, userData, true);
		}

		if (interaction.guildId === null) returnValue.announce = true;
		sendMessage(returnValue, command, client, interaction, args, isInteraction, guildData, userData, false);

		// @ts-expect-error // cause if it's undefined, it's not doing anything anyway
		const disable = returnValue.disableOriginal || command.commandOptions?.defaultReturn?.disableOriginal;
		if (disable && isComponent) {
			// @ts-expect-error // I gotta fix the line above first cause I need to check if it's a component interaction in a type-safe way
			const originalMessage = await interaction.message;
			originalMessage.components.forEach((actionRow: ActionRowBuilder) => {
				actionRow.components.forEach(component => {
					// @ts-expect-error // If it doesn't exist and I add it anyway, it won't do any harm
					component.data.disabled = true;
				});
			});
			if (originalMessage.content) originalMessage.content += "\n\nThis message has been \u202B\u202B and is now disabled";
			else originalMessage.content = "This message has been \u202B\u202B and is now disabled";
			originalMessage.edit({ content: originalMessage.content, components: originalMessage.components }).catch(() => { });
		}
	} catch (e) {
		// makes reply available again
		interaction.reply = reply;
		// @ts-expect-error // If it doesn't exist and I add it anyway, it won't do any harm
		if (isInteraction) interaction.reply({ content: "An error occurred while executing this command.", ephemeral: true }).catch(() => { });
		else interaction.reply("An error occurred while executing this command.").catch(() => { });
		console.error(e);
	}
};

// function that converts default_member_permissions bitfield to a human readable string

function getPermissionsString(permissionString: string) {
	const permissions = parseInt(permissionString);
	if (permissions === 0) return "None";
	if (permissions === 8) return "Administrator";
	if (permissions === 2147483647) return "All";
	const perms = [];
	if (permissions & 1) perms.push("Create Instant Invite");
	if (permissions & 2) perms.push("Kick Members");
	if (permissions & 4) perms.push("Ban Members");
	if (permissions & 8) perms.push("Administrator");
	if (permissions & 16) perms.push("Manage Channels");
	if (permissions & 32) perms.push("Manage Guild");
	if (permissions & 64) perms.push("Add Reactions");
	if (permissions & 128) perms.push("View Audit Log");
	if (permissions & 256) perms.push("Priority Speaker");
	if (permissions & 512) perms.push("Stream");
	if (permissions & 1024) perms.push("View Channel");
	if (permissions & 2048) perms.push("Send Messages");
	if (permissions & 4096) perms.push("Send TTS Messages");
	if (permissions & 8192) perms.push("Manage Messages");
	if (permissions & 16384) perms.push("Embed Links");
	if (permissions & 32768) perms.push("Attach Files");
	if (permissions & 65536) perms.push("Read Message History");
	if (permissions & 131072) perms.push("Mention Everyone");
	if (permissions & 262144) perms.push("Use External Emojis");
	if (permissions & 524288) perms.push("View Guild Insights");
	if (permissions & 1048576) perms.push("Connect");
	if (permissions & 2097152) perms.push("Speak");
	if (permissions & 4194304) perms.push("Mute Members");
	if (permissions & 8388608) perms.push("Deafen Members");
	if (permissions & 16777216) perms.push("Move Members");
	if (permissions & 33554432) perms.push("Use VAD");
	if (permissions & 67108864) perms.push("Change Nickname");
	if (permissions & 134217728) perms.push("Manage Nicknames");
	if (permissions & 268435456) perms.push("Manage Roles");
	if (permissions & 536870912) perms.push("Manage Webhooks");
	if (permissions & 1073741824) perms.push("Manage Emojis");
	return perms.join(", ");
}

function setCooldown(commandString: Command | string, interaction: Message, client: Client<true>) {
	let command: Command;
	if (typeof commandString === "string") {
		const getCommand = client.commands.get(commandString);
		if (getCommand === undefined) return console.error("Could not set cooldown, command not found: " + commandString);
		command = getCommand;
	} else
		command = commandString;
	if (typeof command.commandOptions?.cooldown !== "number") return console.error("Could not set cooldown, command has no cooldown: " + command.name);
	if (command.name === undefined) return console.error("Could not set cooldown, command has no name: " + command.name);
	const cooldown = client.commandCooldowns.get(command.name);
	if (cooldown === undefined) throw new Error("Could not set cooldown, command not found: " + command.name);
	cooldown.set(interaction.author.id, Date.now() + command.commandOptions?.cooldown * 1000);
	setTimeout(() => {
		cooldown.delete(interaction.author.id);
	}, command.commandOptions?.cooldown * 1000);
}

function checkCooldown(commandString: Command | string, interaction: Message, client: Client<true>): string | boolean {
	let command: Command;
	if (typeof commandString === "string") {
		const getCommand = client.commands.get(commandString);
		if (getCommand === undefined) throw new Error("Could not check cooldown, command not found: " + commandString);
		command = getCommand;
	} else
		command = commandString;
	if (command.name === undefined) throw new Error("Could not check cooldown, command has no name: " + command.name);
	const cooldown = client.commandCooldowns.get(command.name);
	if (cooldown === undefined) throw new Error("Could not set cooldown, command not found: " + command.name);
	const authorCooldown = cooldown.get(interaction.author.id);
	if (authorCooldown === undefined) return false;
	let timeLeft = authorCooldown - Date.now();
	timeLeft /= 1000;
	if (timeLeft < 0) {
		cooldown.delete(interaction.author.id);
		return false;
	}
	const timeString = global.functions.convertTime(timeLeft);
	return `You are on cooldown for this command, please wait ${timeString}.`;
}

async function formatCommandReturn(returnValue: CommandReturns, command: Command): Promise<CommandReturnWithoutString> {
	// eslint-disable-next-line no-async-promise-executor
	return await new Promise(async (resolve, reject) => {
		if (returnValue instanceof Promise) {
			const timeout = setTimeout(() => {
				reject(`Command ${command.name} took too long to execute!`);
			}, 4500);
			returnValue = await returnValue;
			clearTimeout(timeout);
		}
		if (typeof returnValue === "string") returnValue = { content: returnValue } as CommandReturnWithoutString;
		returnValue = returnValue as CommandReturnWithoutString;
		if (!checkIfValid(returnValue)) reject(`Command "${command.name}" returned nothing.`);
		// @ts-expect-error // FIXME: I don't have the mental capacity to fix this rn
		if (returnValue?.DM !== undefined) returnValue.DM = await formatCommandReturn(returnValue.DM, command);
		resolve(returnValue);
	});
}

function checkIfValid(returnValue: CommandReturnWithoutString) {
	return (
		(returnValue?.embeds !== undefined
			|| returnValue?.files !== undefined
			|| returnValue?.components !== undefined
			|| returnValue?.content !== undefined
			|| returnValue?.files !== undefined
			// @ts-expect-error // I'm checking if it exists, so it's fine ig
			|| returnValue?.attachments !== undefined
			&& !(returnValue instanceof Message))
		|| returnValue === null
	);
}