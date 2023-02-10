import guildModel from "../../schemas/guild";

import { Guild } from "discord.js";
import Client from "../../types/client";

module.exports = async (client: Client<true>, guild: Guild) => {
	console.info("Deleting MongoDB entry for guild " + guild.name);
	guildModel.findOneAndDelete({ guildId: guild.id }, () => { });
};
