import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

const { IsSomething } = require("sussy-util");
const users = require("../../schemas/user");

module.exports = {
	description: "Deposit money into your bank account",
	aliases: ["dep"],

	options: [
		{
			name: "amount",
			description: "max / Amount to deposit",
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],


	run: (_client, _message, args, _guildInfo, userInfo) => {
		if (!args[0]) return "Please provide the amount you want to deposit.";

		const current = userInfo.economy;
		let moneys = current.wallet;

		if (args[0] === "max") {
			current.bank += current.wallet;
			current.wallet = 0;
		} else {
			if (!IsSomething.isNumber(args[0])) return "Please provide the amount you want to deposit as a number.";
			if (+args[0] > current.wallet) return "You do not have enough money to deposit " + args[0] + " gold.";
			current.bank += +args[0];
			current.wallet -= +args[0];
			moneys = +args[0];
		}

		users.findByIdAndUpdate(userInfo._id, { economy: current }, (err: Error, data: any) => {
			if (err) console.error(err);
			if (!data) return "Error: User not found.";
		});
		return `Deposited ${moneys} gold.`;
	}
} as Command;