import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    description: "Adds a song to the queue",
    aliases: ["p"],
    connectedToVC: true,

    options: [
        {
            name: "query",
            type: ApplicationCommandOptionType.String,
            description: "Link/Name of track to play",
            required: true
        }
    ],

    async run(client, message, args, guildData, userData, isSlashCommand) {
        // @ts-expect-error // cause it's getting caught anyway
        try { message.suppressEmbeds(true); } catch (e) { }
        return client.player.addTrack(message, args);
    }
} as Command;
