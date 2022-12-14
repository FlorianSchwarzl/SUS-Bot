module.exports = (client) => {
    client.user.setActivity(`${client.config.prefix}help`);
    console.log("Bot is ready!");
}
