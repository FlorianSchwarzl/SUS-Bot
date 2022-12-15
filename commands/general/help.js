const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

const { StringUtil } = require("sussyutilbyraphaelbader");
const fs = require("fs");

module.exports = {
    name: "help",
    description: "Displays all commands / more information about one command",
    aliases: ["h"],

    options: [
        {
            name: "query",
            description: "name of the command",
            type: "STRING",
            required: false,
        }
    ],

    run(client, message, args, guildData, userData, isSlashCommand) {
        const menu = new MessageSelectMenu()
            .setCustomId("help")
            .setPlaceholder("Select a category");
        const component = new MessageActionRow();
        const commandName = args[0];
        const embed = new MessageEmbed()
            .setTimestamp(new Date())
            .setTitle("Help panel")
            .setFooter(client.config.embedFooter(client));

        if (commandName === void 0 || commandName.length === 0) {
            embed
                .setDescription(`To see more information type **${client.config.prefix}help {command name}**`);

            fs.readdirSync(`${__dirname}/../`).forEach((d) => {
                embed.addFields({
                    name: StringUtil.capitalize(d),
                    value: "Type `" + client.config.prefix + "help " + d + "` to see more information",
                })
                menu.addOptions({ label: StringUtil.capitalize(d), value: d });
            });;
        } else {
            const cmd = client.commands.get(commandName) ||
                client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (cmd === void 0) {
                return "No command found for: `" + commandName + "`";
            }

            // TODO: Add more information

            embed.addFields(
                {
                    name: "Name",
                    value: cmd.name,
                    inline: true
                },
                {
                    name: "Description",
                    value: cmd.description,
                    inline: true
                },
                {
                    name: "Category",
                    value: cmd.category,
                    inline: true
                },
                {
                    name: cmd.aliases?.length > 1 ? "Aliases" : "Alias",
                    value: cmd.aliases?.length > 0 ? cmd.aliases.join(", ") : "None",
                    inline: true
                },
            );
        }
        component.addComponents(menu);
        return { embeds: [embed], components: [component] };
    }
}
