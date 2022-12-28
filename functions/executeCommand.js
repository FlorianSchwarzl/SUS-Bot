const getGuildData = require("./getGuildData");
const getUserData = require("./getUserData");

module.exports = async (command, client, message, args, isInteraction) => {
    if (command === void 0) return;
    if (client.commandCooldowns.get(command.name).get(message.author.id) !== void 0)
        return message.reply("You are on cooldown for this command! Wait another " + Math.round((client.commandCooldowns.get(command.name).get(message.author.id) - Date.now()) / 1000) + " seconds.");

    const reply = message.reply;
    message.reply = () => { throw new Error("Cannot reply outside of executeCommand.js. Use return or message.channel.send() instead!") };

    try {
        let guildData = await getGuildData(message.guild.id);
        let userData = await getUserData(message.author.id);

        let returnValue = command.run(client, message, args, guildData, userData, isInteraction);
        if (returnValue instanceof Promise) returnValue = await returnValue;
        message.reply = reply;
        if ((typeof returnValue === "string" && returnValue !== "") || returnValue?.embeds !== void 0 || returnValue?.files !== void 0 || returnValue?.components !== void 0 || returnValue?.content !== void 0) {
            if (isInteraction) {
                if (typeof returnValue === "string") message.reply({ content: returnValue, ephemeral: true });
                else {
                    returnValue.ephemeral = true;
                    message.reply(returnValue);
                }
            }
            else message.reply(returnValue);
        } else throw new Error(`Command ${command.name} returned nothing.`);

        if (command.cooldown) {
            client.commandCooldowns.get(command.name).set(message.author.id, Date.now() + command.cooldown * 1000);
            setTimeout(() => {
                client.commandCooldowns.get(command.name).delete(message.author.id);
            }, command.cooldown * 1000);
        }
    } catch (e) {
        message.reply = reply;
        if (isInteraction) message.reply({ content: "An error occurred while executing this command.", ephemeral: true });
        else message.reply("An error occurred while executing this command.");
        console.error(e);
    }
}
