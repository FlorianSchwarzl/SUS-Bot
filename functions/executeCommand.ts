import { PermissionResolvable, Message } from "discord.js";
import { Command, CommandReturnWithoutString } from "../types/command";
import Client from "../types/client";

// TODO: Add automated argument checking

import getGuildData from "./getGuildData";
import getUserData from "./getUserData";
// @ts-expect-error
import formatCommandReturn from "./formatCommandReturn";
import sendMessage from "./sendMessage";


module.exports = async (command: Command, client: Client<true>, interaction: Message, args: string[], isInteraction: boolean, isComponent = false) => {
    if (command === void 0) return;

    // @ts-expect-error
    interaction.author ||= interaction.message.author;

    if (command.default_member_permissions
        && !isInteraction
        && !interaction!.member!.permissions.has(command!.default_member_permissions as PermissionResolvable)) {
        const permissionString = getPermissionsString(command.default_member_permissions);
        const moreThanOne = (permissionString.match(/,/g) || []).length;
        const outputString = `You don't have the permission to use this command. You need the following permission${moreThanOne ? "s" : ""}: ${permissionString}`;
        return interaction.reply(outputString);
    }

    if (command!.commandOptions?.connectedToSameVC)
        command!.commandOptions.connectedToVC = true;

    if (command!.commandOptions?.connectedToVC && !interaction!.member!.voice?.channel)
        return interaction.reply("You need to be in a voice channel to use this command.");

    if (command!.commandOptions?.connectedToSameVC && client!.player?.getQueue(interaction.guildId)?.voiceChannel !== interaction!.member!.voice?.channel?.id) {
        if (client.player.getQueue(interaction.guildId)?.voiceChannel === void 0)
            return interaction.reply("I am not in a voice channel.");
        return interaction.reply("You need to be in the same voice channel as me to use this command.");
    }

    const cooldownReturn = checkCooldown(command, interaction, client);
    if (typeof cooldownReturn === "string") return interaction.reply(cooldownReturn);

    // makes reply unavailable so two replies can't be sent
    const reply = interaction.reply;
    interaction.reply = () => { throw new Error("Cannot reply outside of executeCommand. Use return or message.channel.send() instead!") };
    // @ts-expect-error
    const deferReply = interaction.deferReply;
    // @ts-expect-error
    interaction.deferReply = () => { throw new Error("Cannot defer reply outside of executeCommand. Use return null instead!") };

    try {
        if (command!.commandOptions?.guildOnly && interaction.guildId === null) return interaction.reply("This command can only be used in a server.");

        let guildData;
        if (interaction.guild)
            guildData = await getGuildData(interaction.guild.id);

        let userData = await getUserData(interaction.author.id);

        let returnValue: CommandReturnWithoutString = await formatCommandReturn(command.run(client, interaction, args, guildData, userData, isInteraction), command);

        if (returnValue === null) {
            // @ts-expect-error
            interaction.deferReply = deferReply;
            // @ts-expect-error
            if (isInteraction) interaction.deferReply();
            return;
        }

        // @ts-expect-error // cause if it's undefined, it's not doing anything anyway
        let success = returnValue.success || command!.commandOptions?.defaultReturn?.success;

        if (success) {
            if (returnValue!.setCooldown)
                returnValue.setCooldown.push(command);
            else
                returnValue!.setCooldown = [command];
        }

        // @ts-expect-error // cause if it's undefined, it's not doing anything anyway
        let cooldownArray: Command[] | undefined = returnValue!.setCooldown || command!.commandOptions?.defaultReturn?.setCooldown;

        if (cooldownArray !== void 0)
            cooldownArray.forEach(commandObject => {
                setCooldown(commandObject, interaction, client);
            });

        // makes reply available again
        interaction.reply = reply;

        if (returnValue.DM !== void 0 && returnValue.DM !== null) {
            sendMessage(returnValue.DM, command, client, interaction, args, isInteraction, guildData, userData, true);
        }

        if (interaction.guildId === null) returnValue.announce = true;
        sendMessage(returnValue, command, client, interaction, args, isInteraction, guildData, userData, false);

        // @ts-expect-error // cause if it's undefined, it's not doing anything anyway
        const disable = returnValue.disableOriginal || command!.commandOptions?.defaultReturn?.disableOriginal;
        if (disable && isComponent) {
            // @ts-expect-error
            const originalMessage = await interaction.message;
            // @ts-expect-error
            originalMessage.components.forEach(actionRow => {
                // @ts-expect-error
                actionRow.components.forEach(component => {
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
        // @ts-expect-error
        if (isInteraction) interaction.reply({ content: "An error occurred while executing this command.", ephemeral: true }).catch(() => { });
        else interaction.reply("An error occurred while executing this command.").catch(() => { });
        console.error(e);
    }
}

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
        if (getCommand === void 0) return console.error("Could not set cooldown, command not found: " + commandString);
        command = getCommand;
    } else
        command = commandString;
    if (typeof command!.commandOptions?.cooldown !== "number") return console.error("Could not set cooldown, command has no cooldown: " + command.name);
    if (command.name === void 0) return console.error("Could not set cooldown, command has no name: " + command.name);
    client.commandCooldowns.get(command.name)!.set(interaction!.author.id, Date.now() + command!.commandOptions?.cooldown * 1000);
    setTimeout(() => {
        client.commandCooldowns.get(command.name as string)!.delete(interaction!.author.id);
    }, command!.commandOptions?.cooldown * 1000);
}

function checkCooldown(commandString: Command | string, interaction: Message, client: Client<true>): string | boolean {
    let command: Command;
    if (typeof commandString === "string") {
        const getCommand = client.commands.get(commandString);
        if (getCommand === void 0) throw new Error("Could not check cooldown, command not found: " + commandString);
        command = getCommand;
    } else
        command = commandString;
    if (command.name === void 0) throw new Error("Could not check cooldown, command has no name: " + command.name);
    if (client.commandCooldowns.get(command.name)!.has(interaction!.author.id)) {
        let timeLeft = client.commandCooldowns.get(command.name)!.get(interaction!.author.id)! - Date.now();
        timeLeft /= 1000;
        if (timeLeft > 0) {
            // @ts-expect-error
            const timeString = global.functions.convertTime(timeLeft);
            return `You are on cooldown for this command, please wait ${timeString}.`
        }
    }
    return false;
}