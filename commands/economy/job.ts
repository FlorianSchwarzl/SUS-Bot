import { Command } from "../../types/command";
import { ApplicationCommandOptionType } from "discord.js";

const userList = require("../../schemas/user");
const { EmbedBuilder } = require("discord.js");
const jobs = require("./resources/jobs.json").jobs;

module.exports = {
	description: "Panel which shows jobs",
	aliases: ["jobs"],
	options: [{
		name: "JobID",
		type: ApplicationCommandOptionType.Integer,
		description: "ID of the job to switch to",
		required: false,
	}],

	run(client, _message, args, _guildData, userData) {
		if (args[0] === undefined) {
			const embed = new EmbedBuilder()
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
			if (Number.isNaN(+args[0]))
				return "Provide a valid number as job ID";
			if (currentID === +args[0])
				return "You are already a " + jobs[currentID - 1].jobname;
			if (+args[0] <= 0 || args[0] > jobs.length)
				return "Bad ID";
			if (Math.floor(userData.level.xp / 50) < (jobs[+args[0] - 1].reqlevel)) {
				return "Level too low for this job";
			}

			userData.jobinfo.id = +args[0];
			userList.findByIdAndUpdate(userData._id, { jobinfo: userData.jobinfo }, (err: Error, data: unknown) => {
				if (err) console.error(err);
				if (!data) return "Error: User not found.";
			});
			return "Congratulations! You are now a " + jobs[userData.jobinfo.id - 1].jobname;
		}
	}
} as Command;
