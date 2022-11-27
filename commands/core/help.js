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

        const core = message.client.commands.filter(x => x.category == 'core').map((x) => '`' + x.name + '`').join(', ');
        const music = message.client.commands.filter(x => x.category == 'music').map((x) => '`' + x.name + '`').join(', ');

        const command_name = args[0];
        const embed = new MessageEmbed()
            .setTimestamp(new Date())
            .setTitle('Help panel')
            .setFooter(client.config.embedFooter(client));

        if (!command_name || command_name.length === 0) {
            embed
                .setDescription(`To see more information type **${client.config.prefix}help {command name}**`)
                .addFields({ name: 'Core', value: core },
                {name:"Music", value: music});
        } else {
            const cmd = client.commands.get(command_name) ||
                client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));
            
            if (!cmd) {
                return channel.send("No command found for: `" + command_name + "`");
            }


            embed.addFields(
                { name: 'Name', value: cmd.name, inline: true },
                { name: 'Description', value: cmd.description, inline: true },
                { name: 'Aliase(s)', value: cmd.aliases?.length > 0 ? cmd.aliases.join(', ') : 'None' , inline: true },
            );
        }

        channel.send({ embeds: [embed] });
    }
}