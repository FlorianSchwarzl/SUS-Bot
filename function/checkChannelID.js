module.exports = (message, allowedChannelsIDS) => {
    if (allowedChannelsIDS.length === 0) return true;
    return allowedChannelsIDS.includes(message.channel.id);
}