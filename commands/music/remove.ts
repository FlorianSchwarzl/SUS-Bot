import { Command } from "../../types/command";
const skip = require("./skip");

module.exports = {
	aliases: ["rm"],
	description: "Removes a song from the queue",
	commandOptions: {
		connectedToSameVC: true,
		guildOnly: true
	},

	async run(client, message, args, guildData, userData, isSlashCommand) {
		const playerInfo = client.player.getQueue(message.guild?.id);

		let start, end;

		if (args[0] === "all") {
			start = 1;
			end = playerInfo.queue.length;
		} else if (args[0] === "last") {
			start = playerInfo.queue.length;
			end = playerInfo.queue.length;
		} else {
			start = parseInt(args[0]);
			end = parseInt(args[1]);
		}

		if (isNaN(start)) {
			return "Please provide a valid number";
		} else if (isNaN(end)) {
			end = start;
		}

		if (start < 0 || start > playerInfo.queue.length) {
			return "Please provide a valid number";
		} else if (end < 0 || end > playerInfo.queue.length) {
			return "Please provide a valid number";
		}

		if (start > end) {
			const temp = start;
			start = end;
			end = temp;
		}

		let removedString = "";

		let removedCurrent = false;

		if (start === 0) {
			removedString += `${0}. **${playerInfo.current.title}**\n`;
			await skip.run(client, message, [], guildData, userData, isSlashCommand);
			start = 1;
			removedCurrent = true;
		}

		const elementsToRemove = end - start + 1;

		const removedElements = playerInfo.queue.splice(start - 1, elementsToRemove);

		const removedStringElementsMax = removedCurrent ? 18 : 19;
		const removeStringUnfinished = removedElements.length > removedStringElementsMax;

		for (let i = 0; i < Math.min(removedElements.length, removedStringElementsMax); i++) {
			removedString += `${i + 1}. **${removedElements[i].title}**\n`;
		}

		if (removeStringUnfinished) {
			removedString += `And ${removedElements.length - removedStringElementsMax} more...`;
		}

		const removedElementsNumber = elementsToRemove + (removedCurrent ? 1 : 0);

		return `Removed ${removedElementsNumber} element${removedElementsNumber > 1 ? "s" : ""} from the queue: \n${removedString} `;
	}
} as Command;
