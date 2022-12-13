const userList = require("../../schemas/user");
const { MessageEmbed } = require("discord.js");
const jobs = require("./resources/jobs.json").jobs;

module.exports = {
    name: "job",
    description: "Panel which shows jobs",
    aliases: ["jobs"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        const embed = new MessageEmbed()
            .setTimestamp(new Date())
            .setTitle("Jobs panel")
            .setFooter(client.config.embedFooter(client));
                embed.addFields (
                {
                    name: "Current Job",
                    value: userData.jobinfo.job + "",
                    inline: true
                },
                {
                    name: "Salary",
                    value: userData.jobinfo.salary + "",
                    inline: true
                },
                {
                    name: "Level required",
                    value: userData.jobinfo.level + "",
                    inline: true
                }
        );

        for(let i = 0; i<jobs.length; i++) {
            if (!(userData.jobinfo.job === jobs[i].jobname)) {
                embed.addFields (
                    {
                        name: "Name:",
                        value: jobs[i].jobname + "",
                        inline: true
                    },
                    {
                        name: "Salary:",
                        value: jobs[i].salary + "",
                        inline: true
                    },
                    {
                        name: "Required Level:",
                        value: jobs[i].reqlevel + "",
                        inline: true
                    }
            );
            }
                    
        }

        return { embeds: [embed] };
    }
}
