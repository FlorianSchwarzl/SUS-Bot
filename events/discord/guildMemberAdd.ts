import Client from "../../types/client";
import { GuildMember } from "discord.js";

const fetchData = require("../../config").fetchData;
const welcomeMessages = fetchData.get("messages").welcome;
import guilds from "../../schemas/guild";

module.exports = async (client: Client<true>, member: GuildMember) => {
    const guild = await guilds.findOne({ guildId: member.guild.id });
    if (guild?.channels?.welcome === void 0) return;
    const channel = client.channels.cache.get(guild.channels.welcome);
    // @ts-expect-error // i gotta stop doing this
    channel.send(global.functions.replaceUser(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)], member));
}
