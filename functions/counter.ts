import { Message } from "discord.js";

import guilds from "../schemas/guild";
import { GuildData } from "../types/data";

module.exports = (message: Message, guildData: GuildData) => {
	if (guildData?.channels?.counter === undefined) return;
	if (!(guildData.channels.counter === message.channel.id)) return false;
	const current = guildData.counter.current;
	if (message.content.toLowerCase() == (current + 1) && message.author.id != guildData.counter.lastId)
		guilds.findByIdAndUpdate(guildData._id, { counter: { current: current + 1, lastId: message.author.id } }, (err: Error, data: GuildData) => {
			if (err) console.error(err);
			(err);
			if (!data) return "No data found";
		});
	else message.delete().catch();
	return true;
};
