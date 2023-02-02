import { Component } from "../../types/command";

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

module.exports = {
	run(_client, _interaction) {
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
