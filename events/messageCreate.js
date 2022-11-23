const { Random } = require("sussyutilbyraphaelbader");
const leonDetector = require("../function/leonDetector");

const patreon = [
    'Please subscribe to our patreon.', 
    'Please subscribe to our OnlyFans.', 
    'Please subscribe to our OnlyFans. Our OnlyFans: https://onlyfans.com/stupid-useless-fans', 
    'Please subscribe to our patreon. Our patreon: https://www.patreon.com/Stupid-Useless-Server-Patreon'
];

module.exports = (client, message) => {
    if(leonDetector(message)) return message.channel.send("Halts maul");
    const prefix = client.config.prefix;

    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);

    const troll = Random.randomInt(0, 10);
    if(troll > 7) {
        message.channel.send(patreon[Math.floor(Math.random() * patreon.length)]);
    }
    if (!cmd) return;
    cmd.run(client, message, args);
}