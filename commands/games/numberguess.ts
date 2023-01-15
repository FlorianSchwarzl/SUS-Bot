import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

const { IsSomething } = require("sussy-util");
module.exports = {
    aliases: ["number", "guess"],
    description: "guess a number between 1 and the specified number",
    options: [
        {
            name: "number",
            type: ApplicationCommandOptionType.Number,
            description: "the specified number",
            required: true,
        },
        {
            name: "guess",
            type: ApplicationCommandOptionType.Number,
            description: "the guessed number",
            required: true,
        }
    ],

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (args[0] === void 0 || args[0] === `` || args[1] === void 0 || args[1] === ``) {
            return "Please specify two numbers";
        }
        if (!(IsSomething.isNumber(args[0])) || !(IsSomething.isNumber(args[1]))) {
            return "Both parameters need to be numbers";
        }
        if (args[1] > args[0]) {
            return "First number needs to be larger than the second"
        }
        const number = Math.round(Math.random() * +args[0] - 1) + 1;
        message!.channel!.send("Number was generated! The number is: " + number);

        if (number === +(args[1])) {
            return "Your number is correct!";
        } else
            return "Your number is false!";
    }
} as Command;