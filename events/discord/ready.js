module.exports = (client) => {
    client.user.setActivity(`${client.config.prefix}help`);
    console.success("Bot is ready!");
}
