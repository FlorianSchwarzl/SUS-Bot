const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "userinfo",
    description: "Displays information about the current user.",

    run(client, message, args) {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        
        message.reply({ embeds: [ new MessageEmbed()
            .setTitle("**Userinfo**")
            .setColor("RANDOM")
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: "Username", value: user.username, inline: true },
                { name: "ID", value: user.id, inline: true },
                { name: "Discriminator", value: user.discriminator, inline: true },
                { name: "Bot", value: `${user.bot? "Yes": "No"}`, inline: true },
                { name: "Verified", value: user.verified? "Yes" : "No", inline: true },
                { name: "Created", value: user.createdAt.toDateString(), inline: true },
                { name: "Joined", value: new Date(message.guild.members.cache.get(user.id).joinedTimestamp).toDateString(), inline: true },
            )
            .setTimestamp(new Date())
            .setFooter(client.config.embedFooter(client))
        ]});
    }
}