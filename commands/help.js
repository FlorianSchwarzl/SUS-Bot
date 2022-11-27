const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'help',
    description: "Displays all commands / more information about one command",

    options: [
        {
            name: "query",
            description: "name of the command",
            type: "STRING",
            required: false,
        }
    ],

    run(client, message, args, slash) {
        const channel = slash ? client.channels.cache.get(message.channelId) : message.channel;
        if (slash) {
            message.reply({ content: 'ok', ephemeral: true });
        }

        const command_name = args[0];
        const embed = new MessageEmbed()
            .setTimestamp(new Date())
            .setFooter(client.config.embedFooter(client));

        if (!command_name || command_name.length === 0) {
            embed.setTitle('Help panel')
                .setDescription(`To see more information type **${client.config.prefix}help {command name}**`)
                .addFields({ name: 'Commands', value: client.commands.map((x) => '`' + x.name + '`').join(', ') });
        } else {
            embed;
        }

        channel.send({ embeds: [embed] });
    }
}