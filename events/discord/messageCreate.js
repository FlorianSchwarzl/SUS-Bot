const { Random } = require("sussyutilbyraphaelbader");
const fetchData = require("../../config.js").fetchData;
const channels = fetchData.get("channels");

const selfPromo = fetchData.get("messages").selfPromo;

module.exports = (client, message) => {
    if (message.author.bot) return;                                                 // Ignore bots

    const counter = require("../../functions/counter.js");
    if (counter(message)) return;                                                   // Check if the message is in the counter channel, if so, run the counter function

    const leonDetector = require("../../functions/leonDetector.js");
    if (leonDetector(message)) message.channel.send("Halts maul");                  // We do a lil trolling
    const isBotChannel = require("../../functions/checkChannelID.js");
    if (!isBotChannel(message)) return;                                             // Ignore messages not in allowed channels

    const prefix = client.config.prefix;                                            // Get the prefix from the .env file

    if (!message.content.startsWith(prefix)) return;                                // Ignore messages that don't start with the prefix

    const args = message.content.slice(prefix.length).trim().split(/ +/g);          // Get the arguments
    const command = args.shift().toLowerCase();                                     // Get the command name
    const cmd = client.commands.get(command) ||                                     // Get the command from the commands collection
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
    if (!cmd) return;                                                               // Ignore commands that don't exist

    if (Random.randomInt(0, 9) === 0)                                               // 1/10 chance to send a self-promo message                         
        message.channel.send(selfPromo[Random.randomInt(0, selfPromo.length - 1)]); // Shameless self-promotion

    cmd.run(client, message, args);                                                 // Run the command      
}