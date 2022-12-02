const { findByIdAndUpdate } = require('mongoose');

module.exports = (message, guildData) => {
    if (!(guildData.channels.counter === message.channel)) return false;
    const current = guildData.counter.current;
    if (message.content.toLowerCase() == (current + 1) && message.author.id != guildData.counter.lastId) {
        findByIdAndUpdate(guildData._id, { counter: { current: current + 1, lastId: message.author.id } });
    }
    else message.delete().catch();
    return true;
}
