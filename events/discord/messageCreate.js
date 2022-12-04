const addGuildDocument = require("../../functions/addGuildDocument");
const { Random } = require("sussyutilbyraphaelbader");
const fetchData = require("../../config.js").fetchData;
const guildModel = require("../../schemas/guild");

const selfPromo = fetchData.get("messages").selfPromo;

module.exports = async (client, message) => {
    if (message.author.bot) return;                                                 // Ignore bots
    let guildData = await guildModel.findOne({ guildId: message.guild.id });
    if (!guildData) {
        addGuildDocument(message.guild);
        guildData = await guildModel.findOne({ guildId: message.guild.id });
    }

    const counter = require("../../functions/counter.js");
    if (counter(message, guildData)) return;                                        // Check if the message is in the counter channel, if so, run the counter function

    const leonDetector = require("../../functions/leonDetector.js");
    if (leonDetector(message)) message.channel.send("Halts maul");                  // We do a lil trolling
    const isBotChannel = require("../../functions/checkChannelID.js");
    if (!isBotChannel(message, guildData)) return;                                  // Ignore messages not in allowed channels

    const prefix = client.config.prefix;                                            // Get the prefix from the .env file

    if (!message.content.startsWith(prefix)) return;                                // Ignore messages that don't start with the prefix

    const args = message.content.slice(prefix.length).trim().split(/ +/g);          // Get the arguments
    const commandString = args.shift().toLowerCase();                               // Get the command name
    const command = client.commands.get(commandString) ||                           // Get the command from the commands collection
        client.commands.find(command => command.aliases && command.aliases.includes(commandString));
    if (command === undefined) return;

    let returnString = command.run(client, message, args, guildData);
    if (returnString instanceof Promise) returnString = await returnString;
    if (typeof returnString === 'string' && returnString !== "") message.channel.send(returnString);

    if (Random.randomInt(0, 9) === 0)                                               // 1/10 chance to send a self-promo message                         
        message.channel.send(selfPromo[Random.randomInt(0, selfPromo.length - 1)]); // Shameless self-promotion
}
