import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    description: "Clears the song queue.",
    commandOptions: {
        connectedToSameVC: true
    },

    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.clearQueue(message);
    }
} as Command;
