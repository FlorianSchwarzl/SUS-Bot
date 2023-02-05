import { GuildMember } from "discord.js";

export default (message: string, member: GuildMember) => {
	return message.replace("{user}", "**" + member.user.username + "#" + member.user.discriminator + "**");
};
