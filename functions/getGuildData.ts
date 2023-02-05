import guildModel from "../schemas/guild";
import addGuildDocument from "./addGuildDocument";
import { GuildData } from "../types/data";

export default async (guildId: string): Promise<GuildData> => {
	let guildData = await guildModel.findOne({ guildId: guildId });
	if (!guildData) {
		addGuildDocument(guildId);
		guildData = await guildModel.findOne({ guildId: guildId });
	}
	return guildData;
};
