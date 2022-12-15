const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    run(_client, interaction) {
        const choice = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('GitHub')
                    .setStyle('LINK')
                    .setURL('https://github.com/plastik_flasche/SUS-Bot'),
                new MessageButton()
                    .setLabel('Patreon')
                    .setStyle('LINK')
                    .setURL('https://patreon.com/stupid-useless-patreon'),
                new MessageButton()
                    .setLabel('PayPal')
                    .setStyle('LINK')
                    .setURL('https://paypal.me/stupiduselesspaypal'),
                // new MessageButton()
                //     .setLabel('Crypto')
                //     .setStyle('LINK')
                //     .setURL('')
            );
        interaction.channel.send({ content: 'If you can code, help us out on our Github, if not, maybe buy us some more processing power!', components: [choice] });
    }
}
