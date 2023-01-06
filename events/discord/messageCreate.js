const addGuildDocument = require("../../functions/addGuildDocument");
const executeCommand = require("../../functions/executeCommand.js");
const guildModel = require("../../schemas/guild");

module.exports = async (client, message) => {
    if (message.author.bot) return;                                                 // Ignore bots
    const guildData = await getGuildData(message.guild.id);

    const counter = require("../../functions/counter.js");
    if (counter(message, guildData)) return;                                        // Check if the message is in the counter channel, if so, run the counter function

    const isBotChannel = require("../../functions/checkChannelID.js");
    if (!isBotChannel(message, guildData)) return;                                  // Ignore messages not in allowed channels

    const prefix = client.config.prefix;                                            // Get the prefix from the .env file

    if (!message.content.startsWith(prefix)) return;                                // Ignore messages that don't start with the prefix

    const args = message.content.slice(prefix.length).trim().split(/ +/g);          // Get the arguments
    const commandString = args.shift().toLowerCase();                               // Get the command name
    const command = client.commands.get("command:" + commandString) ||                           // Get the command from the commands collection
        client.commands.find(command => command.aliases && command.aliases.includes(commandString));
    message.followUp = message.reply;

    executeCommand(command, client, message, args, false);                          // Execute the command
}

async function getGuildData(guildId) {
    let guildData = await guildModel.findOne({ guildId: guildId });
    if (!guildData) {
        addGuildDocument(guildId);
        guildData = await guildModel.findOne({ guildId: guildId });
    }
    return guildData;
}