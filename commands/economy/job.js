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

    run(client, _message, args, _guildData, userData) {
        if (args[0] === undefined) {
            const embed = new MessageEmbed()
                .setTimestamp(new Date())
                .setTitle("Jobs panel")
                .setFooter(client.config.embedFooter(client))
                .addFields(
                    {
                        name: "Current Job",
                        value: jobs[userData.jobinfo.id - 1].jobname + "",
                        inline: true
                    },
                    {
                        name: "Salary",
                        value: jobs[userData.jobinfo.id - 1].salary + "",
                        inline: true
                    },
                    {
                        name: "Level required",
                        value: jobs[userData.jobinfo.id - 1].reqlevel + "",
                        inline: true
                    }
                );

            for (let i = 0; i < jobs.length; i++) {
                if (!(userData.jobinfo.id === (i + 1))) {
                    embed.addFields(
                        {
                            name: "JobID: " + (i + 1),
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
            if (args[0] <= 0 || args[0] > jobs.length)
                return "Bad ID";
            if (Math.floor(userData.level.xp / 50) < (jobs[args[0] - 1].reqlevel)) {
                return "Level too low for this job";
            }

            userData.jobinfo.id = args[0];
            userList.findByIdAndUpdate(userData._id, { jobinfo: userData.jobinfo }, (err, data) => { });
            return "Congratulations! You are now a " + jobs[userData.jobinfo.id - 1].jobname;
        }
    }
}
