import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    aliases: [],
    description: "Pauses the current song",
    commandOptions: {
        connectedToSameVC: true
    },

    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.pause(message);
    }
} as Command;
