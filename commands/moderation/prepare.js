const { MessageEmbed } = require("discord.js");

const registering = (client, second) => {
    if (!second.member.permissions.has("ADMINISTRATOR")) return new MessageEmbed()
        .setTitle("Failed to create slash-commands")
        .setDescription("You do not have permissions to create slash-commands");

    const embed = new MessageEmbed()
        .setTitle("Success")

    client.commands.forEach(command => {
        if (command.name === "prepare") return;
        second.guild.commands?.create(command).catch(error => {
            return new MessageEmbed()
                .setTitle("Failed to create slash-commands")
                .setDescription(error.toString());
        });
    });

    return embed;
}

module.exports = {
    name: "prepare",
    description: "Creates slash commands in server",

    async run(client, message, args, guildData, userData, isSlashCommand) {
        const embed = registering(client, message);
        if (isSlashCommand) message.reply({ embeds: [embed] });
        else message.channel.send({ embeds: [embed] });
    }
}