import { Command } from "../../types/command";

module.exports = {
    aliases: [],
    description: "Pauses the current song",
    commandOptions: {
        connectedToSameVC: true
    },

    run(client, message, _args, _guildData, _userData, _isSlashCommand) {
        return client.player.pause(message);
    }
} as Command;
