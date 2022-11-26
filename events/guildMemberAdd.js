const fetchData = require("../config.js").fetchData;
const welcomeChannel = fetchData.get("channels").welcome;
const welcomeMessages = fetchData.get("messages").welcome;

module.exports = (client, member) => {
    const channel = client.channels.cache.get(welcomeChannel);
    channel.send(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)].replace("{user}", member.user.username + "#" + member.user.discriminator));
}