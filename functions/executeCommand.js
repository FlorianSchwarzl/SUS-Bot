// TODO: Add automated argument checking
// TODO: Add automated permission checking

const getGuildData = require("./getGuildData.js");
const getUserData = require("./getUserData.js");
const formatCommandReturn = require("./formatCommandReturn.js");

module.exports = async (command, client, message, args, isInteraction) => {
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

    try {
        let guildData = await getGuildData(message.guild.id);
        let userData = await getUserData(message.author.id);

        let returnValue = await formatCommandReturn(command.run(client, message, args, guildData, userData, isInteraction), command);

        if (returnValue.announce)
            returnValue.ephemeral = false;

        // makes reply available again
        message.reply = reply;
        const sentMessage = await message.reply(returnValue);

        let cooldown;
        if (returnValue.cooldown) cooldown = returnValue.cooldown;
        else cooldown = command.cooldown;

        if (cooldown && returnValue.success !== false) {
            client.commandCooldowns.get(command.name).set(message.author.id, Date.now() + cooldown * 1000);
            setTimeout(() => {
                client.commandCooldowns.get(command.name).delete(message.author.id);
            }, cooldown * 1000);
        }

        if (returnValue.deleteMessage && !isInteraction) message.delete();

        if (returnValue.ephemeral && isInteraction) returnValue.deleteReply = false; // ephemeral messages can't be deleted

        if (returnValue.deleteReply) {
            if (returnValue.deleteReply === true) returnValue.deleteReply = 5;
            setTimeout(() => {
                if (isInteraction) message.deleteReply();
                else sentMessage.delete();
            }, command.deleteReply * 1000);
        }

    } catch (e) {
        // makes reply available again
        message.reply = reply;
        if (isInteraction) message.reply({ content: "An error occurred while executing this command.", ephemeral: true }).catch(() => { });
        else message.reply("An error occurred while executing this command.").catch(() => { });
        console.error(e);
    }
}
