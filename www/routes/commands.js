const { deepClone, removeProperty } = require("sussy-util");
const permissions = require("../../enums/permissionStrings");
const client = require("../../index");
const express = require("express");

const router = express.Router();

router.get("/allcommands", (req, res) => {
    const commandName = [];
    client.commands.forEach(command => commandName.push({ name: command.name, description: command.description }));
    res.send(JSON.stringify(commandName));
});

router.get("/:cmdname", (req, res) => {
    const cmd = req.params.cmdname;
    const command = client.commands.find(cmd1 => cmd1.name === cmd);
    if (!command) return res.status(404).send("");
    const clone = deepClone(command);
    clone.permissions?.forEach((e, i) => {
        for (const key in permissions) {
            if (BigInt(permissions[key]) != e)
                continue;
            clone.permissions[i] = key;
        }
    });
    res.send(JSON.stringify(removeProperty(clone, "default_member_permissions")));
});

module.exports = router;