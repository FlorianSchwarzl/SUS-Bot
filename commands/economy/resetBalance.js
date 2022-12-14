const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "resetbalance",
    description: "Clear your profile",
    aliases: ["cls"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        const confirmation = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('resetBalance')
                    .setLabel('YES')
                    .setStyle('SUCCESS'),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('delete')
                    .setLabel('NO')
                    .setStyle('DANGER'),
            );
        return { embeds: [new MessageEmbed().setDescription("test")], components: [confirmation] };
    }

}