const { MessageEmbed } = require('discord.js');

const registering = (client, second) => {
    if (!second.member.permissions.has("ADMINISTRATOR")) return new MessageEmbed()
        .setTitle("Failed to create slash-commands")
        .setDescription("You do not have permissions to create slash-commands");

    const embed = new MessageEmbed()
        .setTitle("Success")

    client.commands.forEach(command => {
        if(command.name === "prepare") return;
        second.guild.commands?.create(command).catch(error => {
            return new MessageEmbed()
                .setTitle("Failed to create slash-commands")
                .setDescription(error.toString());
        });
    });

    return embed;
}

module.exports = {
    name: 'prepare',
    description: 'Create\'s slash commands which have been been specified beforehand.',

    async run(client, message, args, slash = false) {
        const embed = registering(client, message);
        if (slash) message.reply({ embeds: [embed] });
        else message.channel.send({ embeds: [embed] });
    }
}