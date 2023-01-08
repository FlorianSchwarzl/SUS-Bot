// TODO: Add automated argument checking
// TODO: Add automated permission checking

const getGuildData = require("./getGuildData.js");
const getUserData = require("./getUserData.js");
const formatCommandReturn = require("./formatCommandReturn.js");
const sendMessage = require("./sendMessage.js");

module.exports = async (command, client, message, args, isInteraction, isComponent = false) => {
    if (command === undefined) return;

    if (command.default_member_permissions
        && !isInteraction
        && !message.member.permissions.has(command.default_member_permissions)) {
        const permissionString = getPermissionsString(command.default_member_permissions);
        const moreThanOne = (permissionString.match(/,/g) || []).length;
        const outputString = `You don't have the permission to use this command. You need the following permission${moreThanOne ? "s" : ""}: ${permissionString}`;
        return message.reply(outputString);
    }


    if (command.connectedToSameVoiceChannel)
        command.connectedToVoiceChannel = true;

    if (command.connectedToVoiceChannel && !message.member.voice?.channel)
        return message.reply("You need to be in a voice channel to use this command.");

    if (command.connectedToSameVoiceChannel && client.voiceChannel !== message.member.voice?.channel.id)
        return message.reply("You need to be in the same voice channel as me to use this command.");

    if (client.commandCooldowns.get(command.name).get(message.author.id) !== undefined)
        return message.reply("You are on cooldown for this command! Wait another " + Math.round((client.commandCooldowns.get(command.name).get(message.author.id) - Date.now()) / 1000) + " seconds.");

    // makes reply unavailable so two replies can't be sent
    const reply = message.reply;
    message.reply = () => { throw new Error("Cannot reply outside of executeCommand.js. Use return or message.channel.send() instead!") };
    const deferReply = message.deferReply;
    message.deferReply = () => { throw new Error("Cannot defer reply outside of executeCommand.js. Use return null instead!") };

    try {
        if (command.guildOnly && message.guildId === null) return message.reply("This command can only be used in a server.");

        let guildData;
        if (message.guild)
            guildData = await getGuildData(message.guild.id);

        let userData = await getUserData(message.author.id);

        let returnValue = await formatCommandReturn(command.run(client, message, args, guildData, userData, isInteraction), command);

        if (returnValue === null) {
            message.deferReply = deferReply;
            if (isInteraction) message.deferReply();
            return;
        }

        let cooldown;
        if (returnValue.cooldown) cooldown = returnValue.cooldown;
        else cooldown = command.cooldown;

        if (cooldown && returnValue.success !== false) {
            client.commandCooldowns.get(command.name).set(message.author.id, Date.now() + cooldown * 1000);
            setTimeout(() => {
                client.commandCooldowns.get(command.name).delete(message.author.id);
            }, cooldown * 1000);
        }

        // makes reply available again
        message.reply = reply;

        if (returnValue.DM !== undefined && returnValue.DM !== null) {
            sendMessage(returnValue.DM, command, client, message, args, isInteraction, guildData, userData, true);
        }

        if (message.guildId === null) returnValue.announce = true;
        sendMessage(returnValue, command, client, message, args, isInteraction, guildData, userData, false);

        const disable = returnValue.disableOriginal || command.disableOriginal;
        if (disable && isComponent) {
            const originalMessage = await client.sentMessages.get(message.message.id);
            if (originalMessage) {
                originalMessage.components.forEach(actionRow => {
                    actionRow.components.forEach(component => {
                        component.setDisabled(true);
                    });
                });
                if (originalMessage.content) originalMessage.content += "\n\nThis message has been \u202B\u202B and is now disabled";
                else originalMessage.content = "This message has been \u202B\u202B and is now disabled";
                originalMessage.edit({ content: originalMessage.content, components: originalMessage.components });
                client.sentMessages.delete(message.channel.id);
            }
        }
    } catch (e) {
        // makes reply available again
        message.reply = reply;
        if (isInteraction) message.reply({ content: "An error occurred while executing this command.", ephemeral: true }).catch(() => { });
        else message.reply("An error occurred while executing this command.").catch(() => { });
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