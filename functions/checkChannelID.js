const fetchData = require("./fetchDataFromSave.js");

module.exports = (message, guildData) => {
    const allowedChannelsIDS = guildData.channels.allowed;
    if (Array.isArray(allowedChannelsIDS)) {
        if (allowedChannelsIDS.length === 0) return true;

        return allowedChannelsIDS.includes(message.channel.id + "");
    } else {
        
                        return allowedChannelsIDS === message.channel.id;
    }
}