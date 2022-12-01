const fetchData = require("../../config.js").fetchData;
const goodbyeChannel = fetchData.get("channels").goodbye;
const goodbyeMessages = fetchData.get("messages").goodbye;

const replaceUser = require("../../functions/replaceUser.js");

module.exports = (client, member) => {
	const channel = client.channels.cache.get(goodbyeChannel);
	channel.send(replaceUser(goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)], member));
}