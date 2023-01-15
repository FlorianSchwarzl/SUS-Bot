import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    description: "Skips current track",
    aliases: ["next"],
    commandOptions: {
        connectedToSameVC: true
    },

    run(client, message, args, guildData, userData, isSlashCommand) {
        return client.player.skip(message);                                        // call the skip function from the player
    }
} as Command;
