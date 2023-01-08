const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");


module.exports = {
    description: "Command for testing all the bot's features",

    async run(client, message, args, guildData, userData, isSlashCommand) {
        message.deferReply({ ephemeral: true });
        return null;
    }
}
