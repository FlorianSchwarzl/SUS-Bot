import { Command } from "../../types/command";

module.exports = {
    description: "Shows the current song",
    aliases: ["current"],
    commandOptions: {
        connectedToSameVC: true
    },

    async run(client, message, _args, _guildData, _userData, _isSlashCommand) {
        if (client.player.getQueue(message.guild!.id) === void 0) {
            return "There is no queue";
        }

        const current = client.player.getCurrent(message.guild!.id);

        if (current === void 0) {
            return "Currently not playing anything";
        }

        return `Now Playing: **${current.title}**\n`;
    }
} as Command;
