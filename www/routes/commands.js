const client = require("../../index");
const express = require("express");
const fs = require("fs");


const router = express.Router();

router.get("/", (req, res) => {
    res.send(fs.readFileSync(`${__dirname}\\..\\static\\commands.html`, "utf-8"));
});

router.get("/allcommands", (req, res) => {
    const commandName = [];
    client.commands.forEach(command => commandName.push({ name: command.name, description: command.description }));
    res.send(JSON.stringify(commandName));
});

router.get("/:cmdname", (req, res) => {
    const cmd = req.params.cmdname;
    const command = client.commands.find(cmd1 => cmd1.name === cmd);
    if (command === void 0) return res.status(404).send("");

});

module.exports = router;