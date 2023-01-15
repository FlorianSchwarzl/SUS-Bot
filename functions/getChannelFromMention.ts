import { Guild } from "discord.js";

module.exports = (guild: Guild, mention: string) => {
    if (!mention) return;
    return guild.channels.cache.get(mention.substring(2, mention.length - 1));
}
