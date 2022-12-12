const { IsSomething } = require("sussyutilbyraphaelbader");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "level",
    description: "Shows the level of your account",
    aliases: ["lvl"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        const embed = new MessageEmbed()
            .setTimestamp(new Date())
            .setTitle("Level panel")
            .setFooter(client.config.embedFooter(client));

        embed.addFields (
            {
                    name: "Level",
                    value: Math.floor(userData.level.xp / 50) + "",
                    inline: true
                },
                {
                    name: "XP",
                    value: (userData.level.xp % 50) + "",
                    inline: true
                },
        );
        return { embeds: [embed] };
        message.channel.send("You have " + userData.economy.wallet + " gold in your wallet and " + userData.economy.bank + " gold in your bank");
    }

}