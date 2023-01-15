import { Component } from "../../types/command";

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    run(client, interaction) {
        const choice = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('GitHub')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/plastik_flasche/SUS-Bot'),
                new ButtonBuilder()
                    .setLabel('Patreon')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://patreon.com/stupid-useless-patreon'),
                new ButtonBuilder()
                    .setLabel('PayPal')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://paypal.me/stupiduselesspaypal'),
                // new ButtonBuilder()
                //     .setLabel('Crypto')
                //     .setStyle('LINK')
                //     .setURL('')
            );
        return { content: 'If you can code, help us out on our Github, if not, maybe buy us some more processing power!', components: [choice] };
    }
} as Component;
