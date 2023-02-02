import { Command } from "../../types/command";

module.exports = {
    description: "Skips current track",
    aliases: ["next"],
    commandOptions: {
        connectedToSameVC: true
    },

    run(client, message, _args, _guildData, _userData, _isSlashCommand) {
        return client.player.skip(message);                                        // call the skip function from the player
    }
} as Command;
