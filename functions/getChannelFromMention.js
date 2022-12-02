module.exports = (guild, mention) => {
    return guild.channels.cache.get(mention.substring(2, mention.length - 1));
}