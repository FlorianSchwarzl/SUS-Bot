import { Command } from "../../types/command";

module.exports = {
	description: "Shows the balance of your money",
	aliases: ["bal"],

	run(_client, _message, _args, _guildData, userData, _isSlashCommand) {
		return "You have " + userData.economy.wallet + " gold in your wallet and " + userData.economy.bank + " gold in your bank";
	}

} as Command;
