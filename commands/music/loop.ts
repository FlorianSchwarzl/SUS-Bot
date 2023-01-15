import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    description: "Loops the current queue.",
    aliases: ["repeat"],
    commandOptions: {
        connectedToSameVC: true
    },
    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.toggleLoop(message);
    },
} as Command;
