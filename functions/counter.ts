import { Message } from "discord.js";

import guilds from "../schemas/guild";

module.exports = (message: Message, guildData: any) => {
    ;
    if (guildData?.channels?.counter === void 0) return;
    if (!(guildData.channels.counter === message.channel.id)) return false;
    const current = guildData.counter.current;
    if (message.content.toLowerCase() == (current + 1) && message.author.id != guildData.counter.lastId)
        guilds.findByIdAndUpdate(guildData._id, { counter: { current: current + 1, lastId: message.author.id } }, (err: Error, data: any) => {
            if (err) console.log(err);
            if (!data) return "No data found"
        });
    else message.delete().catch();
    return true;
}
