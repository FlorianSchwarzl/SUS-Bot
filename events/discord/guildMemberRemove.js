const fetchData = require("../../config.js").fetchData;
const goodbyeMessages = fetchData.get("messages").goodbye;
const guilds = require("../../schemas/guild");
const replaceUser = require("../../functions/replaceUser.js");

module.exports = async (client, member) => {
	const guild = await guilds.findOne({ guildId: member.guild.id });
    if(!guild?.channels?.goodbye) return;
	const channel = client.channels.cache.get(guild?.channels?.goodbye);
	channel.send(replaceUser(goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)], member));
}