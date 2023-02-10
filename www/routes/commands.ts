import { deepClone, removeProperty } from "sussy-util";
import permissions from "../../enums/permissionStrings";
import client from "../../index";
// @ts-expect-error
import express from "express";

const router = express.Router();

router.get("/allcommands", (req: any, res: any) => {
	const commandName = [] as { name: string, description: string }[];
	client.commands.forEach(command => commandName.push({ name: command.name!, description: command.description }));
	res.send(JSON.stringify(commandName));
});

router.get("/:cmdname", (req: any, res: any) => {
	const cmd = req.params.cmdname;
	const command = client.commands.find(cmd1 => cmd1.name === cmd);
	if (!command) return res.status(404).send("");
	const clone = deepClone(command) as any;
	clone.permissions?.forEach((e: any, i: number) => {
		for (const key in permissions) {
			// @ts-expect-error
			if (BigInt(permissions[key]) != e)
				continue;
			clone.permissions[i] = key;
		}
	});
	res.send(JSON.stringify(removeProperty(clone, "default_member_permissions")));
});

module.exports = router;