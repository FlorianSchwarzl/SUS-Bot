import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    description: "Shuffles the queue",
    aliases: ["mix"],
    commandOptions: {
        connectedToSameVC: true
    },

    async run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.shuffle(message);
    }
} as Command;
