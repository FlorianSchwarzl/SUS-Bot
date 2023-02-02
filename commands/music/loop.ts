import { Command } from "../../types/command";

module.exports = {
    description: "Loops the current queue.",
    aliases: ["repeat"],
    commandOptions: {
        connectedToSameVC: true
    },
    run(client, message, _args, _guildData, _userData, _isSlashCommand) {
        return client.player.toggleLoop(message);
    },
} as Command;
