const getGuildData = require("./getGuildData");
const getUserData = require("./getUserData");

module.exports = async (command, client, message, args, isInteraction) => {
    if (command === void 0) return;
    if (client.commandCooldowns.get(command.name).get(message.author.id) !== undefined)
        return message.reply("You are on cooldown for this command! Wait another " + Math.round((client.commandCooldowns.get(command.name).get(message.author.id) - Date.now()) / 1000) + " seconds.");
    try {
        let guildData = await getGuildData(message.guild.id);
        let userData = await getUserData(message.author.id);

        let returnValue = command.run(client, message, args, guildData, userData, isInteraction);
        if (returnValue instanceof Promise) returnValue = await returnValue;
        if ((typeof returnValue === "string" && returnValue !== "") || returnValue?.embeds !== undefined) message.reply(returnValue);

        if (command.cooldown) {
            client.commandCooldowns.get(command.name).set(message.author.id, Date.now() + command.cooldown * 1000);
            setTimeout(() => {
                client.commandCooldowns.get(command.name).delete(message.author.id);
            }, command.cooldown * 1000);
        }
    } catch (e) {
        if (isInteraction) message.reply({ content: "An error occurred while executing this command.", ephemeral: true });
        else message.reply("An error occurred while executing this command.");
        console.log(e);
    }
}
