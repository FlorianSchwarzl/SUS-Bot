const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "resetbalance",
    description: "Clear your profile",
    aliases: ["cls"],

    run() {
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
        return { embeds: [new MessageEmbed().setTitle("Do you really want to reset your balance?").setDescription("This can not be reverted.")], components: [confirmation] };
    }

}
