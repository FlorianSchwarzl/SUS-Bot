const { welcomeMessages, welcomeChannelID } = require("../config");

module.exports = (client, member) => {
    const channel = client.channel.get(welcomeChannelID);
    channel.send(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
}