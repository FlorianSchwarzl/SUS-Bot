import Client from "../../types/client";
import { GuildMember } from "discord.js";

const fetchData = require("../../config").fetchData;
const goodbyeMessages = fetchData.get("messages").goodbye;
import guilds from "../../schemas/guild";

module.exports = async (client: Client<true>, member: GuildMember) => {
	const guild = await guilds.findOne({ guildId: member.guild.id });
	if (!guild?.channels?.goodbye) return;
	const channel = client.channels.cache.get(guild?.channels?.goodbye);
	// @ts-expect-error // I hate this // FIXME: PLS!!! // i gotta stop doing this
	channel.send(global.functions.replaceUser(goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)], member));
}
