const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");


module.exports = {
    name: "testbot",
    description: "Command for testing all the bot's features",

    async run(client, message, args, guildData, userData, isSlashCommand) {
        let messagesArray = [];
        let commandsArray = [];
        fs.readdirSync("./commands/").forEach(dir => {
            if (!fs.lstatSync("./commands/" + dir).isDirectory())
                return;
            fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith(".js")).forEach(file => {
                const command = require(`../${dir}/${file}`);
                if (!command.name?.length) return; // If the command either doesn't have a name or the name is empty, ignore it.
                commandsArray.push(command);
            })
        });
        let actionRowArray = [];
        while (commandsArray.length > 5) {
            let actionRow = new MessageActionRow();
            for (let i = 0; i < 5; i++) {
                actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(`command:${commandsArray[i].name}`)
                        .setLabel(commandsArray[i].name)
                        .setStyle("PRIMARY")
                );
                commandsArray.shift();
            }
            actionRowArray.push(actionRow);
        }
        let actionRow = new MessageActionRow();
        for (let i = 0; i < commandsArray.length; i++) {
            actionRow.addComponents(
                new MessageButton()
                    .setCustomId(`command:${commandsArray[i].name}`)
                    .setLabel(commandsArray[i].name)
                    .setStyle("PRIMARY")
            );
        }
        actionRowArray.push(actionRow);
        while (actionRowArray.length > 5) {
            let sendArray = [];
            for (let i = 0; i < 5; i++) {
                sendArray.push(actionRowArray[0]);
                actionRowArray.shift();
            }
            message.channel.send({ embeds: [new MessageEmbed().setDescription("test")], components: sendArray });
        }
        let sendArray = [];
        for (let i = 0; i < actionRowArray.length; i++) {
            sendArray.push(actionRowArray[0]);
            actionRowArray.shift();
        }
        message.channel.send({ embeds: [new MessageEmbed().setDescription("test")], components: sendArray });
    }
}
