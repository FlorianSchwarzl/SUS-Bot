import { Command } from "../../types/command";

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    ignore: true,
    description: "Command for testing all the bot's features",

    async run(client, message, args, guildData, userData, isSlashCommand) {
        // @ts-expect-error // FIXME pls, I think I selected the wrong type
        message.deferReply({ ephemeral: true });
        return null;
    }
} as Command;
