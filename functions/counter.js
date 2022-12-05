const guilds = require("../schemas/guild");

module.exports = (message, guildData) => {
    if (!(guildData.channels.counter === message.channel.id)) return false;
    const current = guildData.counter.current;
    if (message.content.toLowerCase() == (current + 1) && message.author.id != guildData.counter.lastId) {
    guilds.findByIdAndUpdate(guildData._id, { counter: { current: current + 1, lastId: message.author.id } }, (err, data) => { });
        }
   
        else message.delete().catch();
    return true;
}
