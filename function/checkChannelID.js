module.exports = (message, allowedChannelsIDS) => {
    if (Array.isArray(allowedChannelsIDS)) {
        if (allowedChannelsIDS.length === 0) return true;
        return allowedChannelsIDS.includes(message.channel.id + "");
    } else {
        return allowedChannelsIDS === message.channel.id;
    }
}