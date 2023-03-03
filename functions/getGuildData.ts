import guildModel from "../schemas/guild";
import addGuildDocument from "./addGuildDocument";
import { GuildData } from "../types/data";

export default async (guildId: string | undefined): Promise<GuildData> => {
	if (guildId === undefined) return null;
	let guildData = await guildModel.findOne({ guildId: guildId }) as GuildData;
	if (!guildData) {
		addGuildDocument(guildId);
		guildData = await guildModel.findOne({ guildId: guildId });
	}
	return guildData;
};
