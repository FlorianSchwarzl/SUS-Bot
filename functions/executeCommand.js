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
        && !message.member.permissions.has(command.default_member_permissions))
        return message.reply(client.errorStrings.PERMISSION_ERROR);

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
        if (command.guildOnly && message.channel.type === "dm") return message.reply("This command can only be used in a server.");

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
