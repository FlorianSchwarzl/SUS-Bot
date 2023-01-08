const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    description: "Clears your balance",
    aliases: ["clb", "clearbalance", "resetbalance", "rb", "resetbal", "clearbal"],

    run(client, message, args, guildData, userData, isInteraction) {
        const embed = new MessageEmbed()
            .setTitle("Reset Balance")
            .setDescription("Are you sure you want to reset your balance?")
            .setColor("RED")
            .setFooter(client.config.embedFooter(client));

        if (isInteraction) {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("resetBalance")
                        .setLabel("Confirm")
                        .setStyle("DANGER"),
                );

            return { embeds: [embed], components: [row] };
        } else {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`resetBalance`)
                        .setLabel("Confirm")
                        .setStyle("DANGER"),
                );
            return { content: "Check your DMs!", DM: { embeds: [embed], components: [row], disable: 60 } };
        }
    }
}
