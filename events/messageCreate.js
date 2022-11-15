const leonDetector = require("../function/leonDetector")
const christmasDetector = require("../function/christmasDetector")

module.exports = (client, message) => {
    if(leonDetector(message)) return message.channel.send("Halts maul");
    if(christmasDetector(message)) return message.delete();
    if(!message.content.startsWith(client.config.prefix)) return;
}