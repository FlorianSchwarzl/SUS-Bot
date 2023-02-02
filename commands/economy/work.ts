import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

const userList = require("../../schemas/user");
const jobs = require("./resources/jobs.json").jobs;

module.exports = {
    description: "Work to earn money",
    aliases: ["wk"],
    commandOptions: {
        cooldown: 1800
    },
    options: [{
        name: "job",
        type: ApplicationCommandOptionType.String,
        description: "Job you want to work as",
        required: true,
    }],

    run(_client, message, _args, _guildData, userData, _isSlashCommand) {
        if (userData.economy) {
            let earned = Math.round(Math.random() * (jobs[userData.jobinfo.id - 1].salary)) + Math.floor(jobs[userData.jobinfo.id - 1].salary / 3);
            userData.economy.wallet += earned;
            userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err: Error, data: any) => {
                if (err) console.error(err);
                if (!data) return "Error: User not found.";
            });
            userData.level.xp += 5;
            userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err: Error, data: any) => {
                if (err) console.error(err);
                if (!data) return "Error: User not found.";
            });
            if (!(Math.floor(userData.level.xp / 50) === (Math.floor((userData.level.xp - 5) / 50)))) {
                message!.channel!.send(`<@${userData.userId}>` + " just levelled up!")
            }
            return { content: "Congratulations! You earned " + earned + " gold as a " + jobs[userData.jobinfo.id - 1].jobname + ". \nNow you have: " + userData.economy.wallet + "!", setCooldown: [this] };
        }
    }
} as Command;
