import { Command } from "../../types/command";
import Client from "../../types/client";
import { ApplicationCommandOptionType, CommandInteraction, Message } from "discord.js";

const { EmbedBuilder } = require("discord.js");

const registering = (client: Client<true>, message: CommandInteraction | Message) => {
    // @ts-expect-error
    if (!message.member!.permissions.has("ADMINISTRATOR")) return new EmbedBuilder()
        .setTitle("Failed to create slash-commands")
        .setDescription("You do not have permissions to create slash-commands");

    const embed = new EmbedBuilder()
        .setTitle("Success")

    client.commands.forEach((command: Command) => {
        if (command.name === "prepare") return;
        // @ts-expect-error // cause name can't be undefined, look at index.js
        message.guild!.commands?.create(command).catch((error: Error) => {
            return new EmbedBuilder()
                .setTitle("Failed to create slash-commands")
                .setDescription(error.toString());
        });
    });

    return embed;
}

module.exports = {
    description: "Creates slash commands in server",

    async run(client, message, args, guildData, userData, isSlashCommand) {
        const embed = registering(client, message);
        return { embeds: [embed] };
    }
} as Command;
