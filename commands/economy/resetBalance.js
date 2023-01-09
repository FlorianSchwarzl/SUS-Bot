const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle } = require("discord.js");

module.exports = {
    description: "Clears your balance",
    aliases: ["clb", "clearbalance", "resetbalance", "rb", "resetbal", "clearbal"],

    run(client, message, args, guildData, userData, isInteraction) {
        const embed = new EmbedBuilder()
            .setTitle("Reset Balance")
            .setDescription("Are you sure you want to reset your balance?")
            .setColor(Colors.Red)
            .setFooter(client.config.embedFooter(client));

        if (isInteraction) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("resetBalance")
                        .setLabel("Confirm")
                        .setStyle(ButtonStyle.Danger),
                );

            return { embeds: [embed], components: [row], disable: 60 };
        } else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`resetBalance`)
                        .setLabel("Confirm")
                        .setStyle(ButtonStyle.Danger),
                );
            return { content: "Check your DMs!", DM: { embeds: [embed], components: [row], disable: 60 } };
        }
    }
}
