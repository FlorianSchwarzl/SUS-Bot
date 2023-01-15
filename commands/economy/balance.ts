import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    description: "Shows the balance of your money",
    aliases: ["bal"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        return "You have " + userData.economy.wallet + " gold in your wallet and " + userData.economy.bank + " gold in your bank";
    }

} as Command;
