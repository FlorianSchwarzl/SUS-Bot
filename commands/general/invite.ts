import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    description: "Sends the invite link of the server",
    commandOptions: {
        guildOnly: true,
    },

    async run(client, message, args, guildData, userData, isSlashCommand) {
        // @ts-expect-error // It can't even get to this point if it's not a guild
        const invite = await message.channel!.createInvite({ unique: true, temporary: true });
        return "https://discord.gg/" + invite.code;
    }
} as Command;
