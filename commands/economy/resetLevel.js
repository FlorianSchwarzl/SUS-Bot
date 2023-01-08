const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    description: "Clears your level",
    aliases: ["cll", "clearlevel", "resetlevel", "rl", "resetlvl", "clearlvl"],

    run(client, message, args, guildData, userData, isInteraction) {
        const embed = new MessageEmbed()
            .setTitle("Reset Level")
            .setDescription("Are you sure you want to reset your level?")
            .setColor("RED")
            .setFooter("This action cannot be undone!");

        if (isInteraction) {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("resetLevel")
                        .setLabel("Confirm")
                        .setStyle("DANGER"),
                );

            return { embeds: [embed], components: [row] };
        } else {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`resetLevel`)
                        .setLabel("Confirm")
                        .setStyle("DANGER"),
                );
            return { content: "Check your DMs!", DM: { embeds: [embed], components: [row], disable: 60 } };
        }
    }
}