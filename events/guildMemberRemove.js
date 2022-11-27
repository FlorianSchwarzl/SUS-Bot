const fetchData = require("../config.js").fetchData;
const goodbyeMessages = fetchData.get("messages").goodbye;

module.exports = (client, member) => {
	const channel = client.channels.cache.get(fetchData.get("channels").goodbye);
	channel.send(goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)].replace("{user}", member.user.username + "#" + member.user.discriminator));
}