const fetchData = require("../../config.js").fetchData;
const welcomeChannel = fetchData.get("channels").welcome;
const welcomeMessages = fetchData.get("messages").welcome;

const replaceUser = require("../../functions/replaceUser.js");

module.exports = (client, member) => {
    const channel = client.channels.cache.get(welcomeChannel);
    channel.send(replaceUser(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)], member));
}