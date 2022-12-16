const userList = require("../../schemas/user");
const { MessageEmbed } = require("discord.js");
const jobs = require("./resources/jobs.json").jobs;
const { IsSomething } = require("sussyutilbyraphaelbader");

module.exports = {
    name: "bet",
    description: "Bet your money and win!",

    run(client, message, args, guildData, userData, isSlashCommand) {

        const embed = new MessageEmbed()
                .setTimestamp(new Date())
                .setTitle("Casino")
                .setFooter(client.config.embedFooter(client));

        if (!(IsSomething.isNumber(args[0]))) {
            embed.addFields(
                {
                    name: "Bet failed!",
                    value: "Please enter a valid number",
                    inline: true
                }
            );
        }
        else if (args[0] > userData.economy.wallet) {
            embed.addFields(
                {
                    name: "Bet failed!",
                    value: "Please enter a number less than or equal to your wallet",
                    inline: true
                }
            );
        }
        else {
            const random = Math.round((Math.random()));

            switch (random) {
                case 0:
                    userData.economy.wallet -= args[0];
                    embed.addFields(
                {
                    name: "You Lost!",
                    value: "Oh No! You lost " + args[0] + " gold!",
                    inline: true
                }
            );
                    break;
                default:
                    userData.economy.wallet += args[0];
                    embed.addFields(
                {
                    name: "You won!",
                    value: "Congratulations! You won " + args[0] + " gold!",
                    inline: true
                }
            );
                    break;
            }
            userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err, data) => { });
        }
        return { embeds: [embed] };
    }
}
