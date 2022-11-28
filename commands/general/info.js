const { MessageEmbed, version: discordjsVersion } = require('discord.js');
const ms = require('@parade/pretty-ms');

module.exports = {
    name: "info",
    description: "Displays information about the bot.",

    run(client, message, args) {
        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`${client.user.username} v${require("../../package.json")["version"]}`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setURL("https://github.com/plastik-flasche/SUS-Bot")
                .addField('Uptime', `${ms(client.uptime)}`, true)
                .addField('WebSocket Ping', `${client.ws.ping}ms`, true)
                .addField('Discord.js', `${discordjsVersion}`, true)
                .addField('Guild Count', `${client.guilds.cache.size} guilds`, true)
                .addField(`User Count`, `${client.users.cache.size} users`, true)
                .addField('Commands', `${client.commands.size} commands`, true)
                .addField('Memory', `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap`, true)
                .addField('Cached Data', `${client.users.cache.size} users\n${client.emojis.cache.size} emojis`, true)
                .addField('Node', `${process.version} on ${process.platform} ${process.arch}`, true)
                .setFooter(client.config.embedFooter(client))
                .setTimestamp(new Date())]
        })
    }
}