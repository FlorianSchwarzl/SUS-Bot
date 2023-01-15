import { Component } from "../../types/command";

module.exports = {
    run(client, interaction, args, guildData, userData) {
        console.info("helpmenu.js", args);
        return "This command is currently WIP but I already known that you selected " + args[0] + "! MAGIC!";
    }
} as Component;