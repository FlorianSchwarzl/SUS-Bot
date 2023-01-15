import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

const userList = require("../../schemas/user");
const messages = require("../../resources/messages.json");

module.exports = {
    ignore: true, // the messages is kinda broken
    //TODO: fix the messages

    description: "Beg to earn money",
    cooldown: 60,

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (userData.economy?.wallet < 200)
            return "Not enough money to risk on losing";
        const earned = Math.round(Math.random() * 400) - 200;
        userData.economy.wallet += earned;
        userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err: Error, data: any) => {
            if (err) console.error(err);
            if (!data) return "Error: User not found.";
        });
        userData.level.xp += 2;
        userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err: Error, data: any) => {
            if (err) console.error(err);
            if (!data) return "Error: User not found.";
        });
        if (!(Math.floor(userData.level.xp / 50 /*0.5*/) === (Math.floor((userData.level.xp - 5) / 50) /*0.6*/))) {
            message.channel!.send(`<@${userData.userId}>` + " just levelled up!")
        }

        let valueRange = Math.ceil(Math.abs(earned / 100));
        if (earned < 0) valueRange *= -1;

        switch (valueRange) {
            case -2:
                return messages.beg.veryBad.replace("{amount}", Math.abs(earned));
            case -1:
                return messages.beg.bad.replace("{amount}", Math.abs(earned));
            case 0:
                return messages.beg.neutral;
            case 1:
                return messages.beg.good.replace("{amount}", earned);
            case 2:
                return messages.beg.veryGood.replace("{amount}", earned);
        }
    }
} as Command;