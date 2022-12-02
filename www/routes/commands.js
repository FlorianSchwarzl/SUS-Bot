const client = require('../../index');
const express = require('express');
const fs = require('fs');


const router = express.Router();

router.get('/', (req, res) => {
    res.send(fs.readFileSync(`${__dirname}\\..\\static\\commands.html`, "utf-8"));
});

router.get('/allcommands', (req, res) => {
    const commandName = [];
    client.commands.forEach(command => commandName.push({ name: command.name, description: command.description }));
    res.send(JSON.stringify(commandName));
});

module.exports = router;