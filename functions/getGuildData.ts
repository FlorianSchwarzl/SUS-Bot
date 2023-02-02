import guildModel from "../schemas/guild";
import addGuildDocument from "./addGuildDocument";

export default async (guildId: string) => {
	let guildData = await guildModel.findOne({ guildId: guildId });
	if (!guildData) {
		addGuildDocument(guildId);
		guildData = await guildModel.findOne({ guildId: guildId });
	}
	return guildData;
}
