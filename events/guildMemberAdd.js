const { welcomeMessages, welcomeChannelID } = require("../config");

module.exports = (client, member) => {
    const channel = client.channels.cache.get(welcomeChannelID);
    channel.send(member.user.username + " " + welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
}