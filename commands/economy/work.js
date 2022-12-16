const userList = require("../../schemas/user");
const jobs = require("./resources/jobs.json").jobs;

module.exports = {
    name: "work",
    description: "Work to earn money",
    aliases: ["wk"],
    cooldown: 1800,

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (userData.economy) {
            let earned = Math.round(Math.random() * (jobs[userData.jobinfo.id-1].salary)) + Math.floor(jobs[userData.jobinfo.id-1].salary / 3);
            userData.economy.wallet += earned;
            userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err, data) => { });
            userData.level.xp += 5;
            userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err, data) => { });
            if (!(Math.floor(userData.level.xp / 50) === (Math.floor((userData.level.xp - 5) / 50)))) {
                message.channel.send(`<@${userData.userId}>` + " just levelled up!")
            }
            return ("Congratulations! You earned " + earned + " gold as a " + jobs[userData.jobinfo.id-1].jobname + ". \nNow you have: " + userData.economy.wallet + "!");
        }
    }
}
