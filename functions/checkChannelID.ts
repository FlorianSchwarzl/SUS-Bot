import { Guild, Message } from "discord.js";

const fetchData = require("./fetchDataFromSave.js");

module.exports = (message: Message, guildData: any) => {
    if (guildData?.channels?.allowed === void 0) return true;
    const allowedChannelsIDS = guildData.channels.allowed;
    if (Array.isArray(allowedChannelsIDS)) {
        if (allowedChannelsIDS.length === 0) return true;
        return allowedChannelsIDS.includes(message.channel.id + "");
    } else {
        return allowedChannelsIDS === message.channel.id;
    }
}
