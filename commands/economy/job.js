const userList = require("../../schemas/user");
const { MessageEmbed } = require("discord.js");
const jobs = require("./resources/jobs.json").jobs;
const { IsSomething } = require("sussyutilbyraphaelbader");

module.exports = {
    name: "job",
    description: "Panel which shows jobs",
    aliases: ["jobs"],
    options: {
        name: "JobID",
        type: "number",
        description: "ID of the job to switch to",
        required: false,
    },

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (args[0] === undefined) {
            const embed = new MessageEmbed()
                .setTimestamp(new Date())
                .setTitle("Jobs panel")
                .setFooter(client.config.embedFooter(client));
            embed.addFields(
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

            for (let i = 0; i < jobs.length; i++) {
                if (!(userData.jobinfo.job === jobs[i].jobname)) {
                    embed.addFields(
                        {
                            name: "JobID: " + jobs[i].id,
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
        } else {
            const currentID = userData.jobinfo.id;

            if (!IsSomething.isNumber(+args[0]))
                return "Provide a valid number as job ID";
            if (currentID === +args[0])
                return "You are already a " + jobs[currentID - 1].jobname;
            if (!jobs.find(job => job.id === +args[0]))
                return "Bad ID";
            if (userData.jobinfo.level < jobs[args[0] - 1].reqlevel) {
                console.log(userData.jobinfo.level, jobs[args[0] - 1].reqlevel);
                return "Level too low for this job";
            }

            userData.jobinfo.id = jobs[+args[0] - 1].id;
            userData.jobinfo.job = jobs[+args[0] - 1].jobname;
            userData.jobinfo.level = jobs[+args[0] - 1].reqlevel;
            userData.jobinfo.salary = jobs[+args[0] - 1].salary;
            userList.findByIdAndUpdate(userData._id, { jobinfo: userData.jobinfo }, (err, data) => { });
            return "Congratulations! You are now a " + userData.jobinfo.job;

        }
    }
}
