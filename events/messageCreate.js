const leonDetector = require("../function/leonDetector");
const christmasDetector = require("../function/christmasDetector");
const { Random } = require("sussyutilbyraphaelbader");

const patreon = [
    'Please subscribe to our patreon.', 
    'Please subscribe to our OnlyFans.', 
    'Please subscribe to our OnlyFans. Our OnlyFans: https://onlyfans.com/stupid-useless-fans', 
    'Please subscribe to our patreon. Our patreon: https://www.patreon.com/Stupid-Useless-Server-Patreon'
];

module.exports = (client, message) => {
    if(leonDetector(message)) return message.channel.send("Halts maul");
    if(christmasDetector(message)) return message.delete();
    if(!message.content.startsWith(client.config.prefix)) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    const troll = (new Random()).randomInt(0, 10);
    if(troll > 7) {
        message.channel.send(patreon[Math.floor(Math.random() * patreon.length)]);
    }
    if (!cmd) return;
}