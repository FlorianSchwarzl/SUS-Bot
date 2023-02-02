import { Command } from "../../types/command";

module.exports = {
    ignore: true,
    description: "Command for testing all the bot's features",

    async run(_client, message, _args, _guildData, _userData, _isSlashCommand) {
        // @ts-expect-error // FIXME pls, I think I selected the wrong type
        message.deferReply({ ephemeral: true });
        return null;
    }
} as Command;
