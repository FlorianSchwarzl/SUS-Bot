import { Component } from "../../types/command";

module.exports = {
	run(_client, _interaction, args, _guildData, _userData) {
		console.info("helpmenu.js", args);
		return "This command is currently WIP but I already known that you selected " + args[0] + "! MAGIC!";
	}
} as Component;