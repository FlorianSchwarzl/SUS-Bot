// TODO: Add automated argument checking

const getGuildData = require("./getGuildData.js");
const getUserData = require("./getUserData.js");
const formatCommandReturn = require("./formatCommandReturn.js");
const sendMessage = require("./sendMessage.js");

module.exports = async (command, client, interaction, args, isInteraction, isComponent = false) => {
    if (command === undefined) return;

    if (command.default_member_permissions
        && !isInteraction
        && !interaction.member.permissions.has(command.default_member_permissions)) {
        const permissionString = getPermissionsString(command.default_member_permissions);
        const moreThanOne = (permissionString.match(/,/g) || []).length;
        const outputString = `You don't have the permission to use this command. You need the following permission${moreThanOne ? "s" : ""}: ${permissionString}`;
        return interaction.reply(outputString);
    }

    if (command.connectedToSameVoiceChannel)
        command.connectedToVoiceChannel = true;

    if (command.connectedToVoiceChannel && !interaction.member.voice?.channel)
        return interaction.reply("You need to be in a voice channel to use this command.");

    if (command.connectedToSameVoiceChannel && client.player.getQueue(interaction.guildId)?.voiceChannel !== interaction.member.voice?.channel.id) {
        if (client.player.getQueue(interaction.guildId)?.voiceChannel === undefined)
            return interaction.reply("I am not in a voice channel.");
        return interaction.reply("You need to be in the same voice channel as me to use this command.");
    }

    const cooldown = client.commandCooldowns.get(command.name).get(interaction.author.id);
    if (cooldown !== undefined)
        return interaction.reply("You are on cooldown for this command! Wait another " +
            global.functions.convertTime(
                Math.round(cooldown - Date.now()) / 1000)
            + ".");

    // makes reply unavailable so two replies can't be sent
    const reply = interaction.reply;
    interaction.reply = () => { throw new Error("Cannot reply outside of executeCommand.js. Use return or message.channel.send() instead!") };
    const deferReply = interaction.deferReply;
    interaction.deferReply = () => { throw new Error("Cannot defer reply outside of executeCommand.js. Use return null instead!") };

    try {
        if (command.guildOnly && interaction.guildId === null) return interaction.reply("This command can only be used in a server.");

        let guildData;
        if (interaction.guild)
            guildData = await getGuildData(interaction.guild.id);

        let userData = await getUserData(interaction.author.id);

        let returnValue = await formatCommandReturn(command.run(client, interaction, args, guildData, userData, isInteraction), command);

        if (returnValue === null) {
            interaction.deferReply = deferReply;
            if (isInteraction) interaction.deferReply();
            return;
        }

        let success = returnValue.success || command.success;

        if (success !== undefined && success !== null) {
            let cooldownArray = returnValue.success || command.success || [command.cooldown !== undefined];

            cooldownArray.forEach(commandObject => {
                if (typeof commandObject === "string")
                    commandObject = client.commands.get(commandObject);
                if (commandObject === undefined) return console.error("Could not set cooldown, command not found: " + commandObject);
                if (typeof commandObject.cooldown !== "number") return console.error("Could not set cooldown, command has no cooldown: " + commandObject.name);
                client.commandCooldowns.get(commandObject.name).set(interaction.author.id, Date.now() + commandObject.cooldown * 1000);
                setTimeout(() => {
                    client.commandCooldowns.get(commandObject.name).delete(interaction.author.id);
                }, commandObject.cooldown * 1000);
            });
        }

        // makes reply available again
        interaction.reply = reply;

        if (returnValue.DM !== undefined && returnValue.DM !== null) {
            sendMessage(returnValue.DM, command, client, interaction, args, isInteraction, guildData, userData, true);
        }

        if (interaction.guildId === null) returnValue.announce = true;
        sendMessage(returnValue, command, client, interaction, args, isInteraction, guildData, userData, false);

        const disable = returnValue.disableOriginal || command.disableOriginal;
        if (disable && isComponent) {
            const originalMessage = await interaction.message;
            originalMessage.components.forEach(actionRow => {
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
        if (isInteraction) interaction.reply({ content: "An error occurred while executing this command.", ephemeral: true }).catch(() => { });
        else interaction.reply("An error occurred while executing this command.").catch(() => { });
        console.error(e);
    }
}

// function that converts default_member_permissions bitfield to a human readable string

function getPermissionsString(permissions) {
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