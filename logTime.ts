import { Command } from "./types/command";
import fs from "fs";

export default (command: Command, tookTime: number[]) => {
	if (!command.name) return;
	const timeMs = tookTime[0] * 1000 + tookTime[1] / 1000000;
	try {
		fs.accessSync("./Times.json");
	} catch (err) {
		fs.writeFileSync("./Times.json", "{}");
	}
	const times = JSON.parse(fs.readFileSync("./Times.json", "utf-8"));
	if (!times[command.name]) times[command.name] = [];
	times[command.name].push(timeMs);
	if (times[command.name].length > 100) times[command.name].shift();
	fs.writeFileSync("./Times.json", JSON.stringify(times, null, 4));
};
