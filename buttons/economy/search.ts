import { Component } from "../../types/command";

import userList from "../../schemas/user";
import { Random } from "sussy-util";

module.exports = {
	name: "search",
	commandOptions: {
		cooldown: 60
	},
	async run(_client, _interaction, args, _guildData, userData) {
		const amount = Random.randomInt(900, 1600);
		const current = userData.economy;
		current.wallet += amount;
		userList.findByIdAndUpdate(userData._id, { economy: current }, (err: Error, data: any) => { err; data; });
		userData.level.xp += 2;
		userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err: Error, data: any) => { err; data; });
		return { content: `You found ${amount} gold in the ${args[0]}.`, disableOriginal: true, success: ["command:search", this] };
	}
} as Component;