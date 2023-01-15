import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    description: "Stops the music and clears the queue",
    aliases: ["disconnect", "leave"],
    commandOptions: {
        connectedToSameVC: true
    },

    async run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.stop(message);
    }
} as Command;
