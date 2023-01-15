import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    aliases: ["unpause"],
    description: "Resumes playing",
    commandOptions: {
        connectedToSameVC: true
    },

    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.resume(message);
    }
} as Command;
