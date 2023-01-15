import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

const { IsSomething } = require("sussy-util");
const userList = require("../../schemas/user");
module.exports = {
    description: "Withdraw money from your bank account",
    aliases: ["with", "wth"],
    options: [{
        name: "amount",
        type: ApplicationCommandOptionType.String,
        description: "Amount that will be withdrawn",
        required: true,
    }],

    run(client, message, args, guildData, userData, isSlashCommand) {
        let amount = args[0];
        if (amount && IsSomething.isNumber(amount)) {
            if (amount > userData.economy.bank) amount = userData.economy.bank;
            userData.economy.bank -= +amount;
            userData.economy.wallet += +amount;
            userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err: Error, data: any) => {
                if (err) console.error(err);
                if (!data) return "Error: User not found.";
            });
            return amount + " withdrawn. You now have " + userData.economy.wallet + " gold in your wallet and " + userData.economy.bank + " gold in your bank";
        }
        else {
            return "Please specify an amount";
        }
    }
} as Command;
